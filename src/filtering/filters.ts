import { Environment } from "../environment/api";
import { PullRequest } from "../storage/loaded-state";
import { MuteConfiguration } from "../storage/mute-configuration";
import { EnrichedPullRequest } from "./enriched-pull-request";
import { isMuted, MutedResult } from "./muted";
import { isReviewRequired, pullRequestState } from "./status";

export enum Filter {
  // contains requested review and mentioned PRs
  INCOMING = "incoming",
  REVIEWED = "reviewed",
  MUTED = "muted",
  MINE = "mine",
  IGNORED = "ignored",
}

export type FilteredPullRequests = {
  [filter in Filter]: EnrichedPullRequest[];
};

export function filterPullRequests(
  env: Environment,
  userLogin: string,
  openPullRequests: PullRequest[],
  muteConfiguration: MuteConfiguration
): FilteredPullRequests {
  const enrichedPullRequests = openPullRequests.map((pr) => ({
    state: pullRequestState(pr, userLogin),
    ...pr,
  }));

  const ignoreNewCommits = !!muteConfiguration.ignoreNewCommits;
  return {
    incoming: enrichedPullRequests
      .filter(
        (pr) =>
          isReviewRequired(pr.state, ignoreNewCommits) &&
          isMuted(env, pr, muteConfiguration) === MutedResult.VISIBLE
      )
      .filter((v, i, a) => a.findIndex((t) => t.nodeId === v.nodeId) === i),
    muted: enrichedPullRequests
      .filter(
        (pr) =>
          isReviewRequired(pr.state, ignoreNewCommits) &&
          isMuted(env, pr, muteConfiguration) === MutedResult.MUTED
      )
      .filter((v, i, a) => a.findIndex((t) => t.nodeId === v.nodeId) === i),
    reviewed: enrichedPullRequests
      .filter(
        (pr) =>
          pr.state.kind === "incoming" &&
          !pr.state.newReviewRequested &&
          (!pr.state.newCommit || ignoreNewCommits) &&
          !pr.state.authorResponded
      )
      .filter((v, i, a) => a.findIndex((t) => t.nodeId === v.nodeId) === i),
    mine: enrichedPullRequests
      .filter((pr) => pr.author.login === userLogin)
      .filter((v, i, a) => a.findIndex((t) => t.nodeId === v.nodeId) === i),
    ignored: enrichedPullRequests
      .filter(
        (pr) => isMuted(env, pr, muteConfiguration) === MutedResult.INVISIBLE
      )
      .filter((v, i, a) => a.findIndex((t) => t.nodeId === v.nodeId) === i),
  };
}
