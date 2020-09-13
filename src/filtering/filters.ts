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
    incoming: enrichedPullRequests.filter(
      (pr) =>
        isReviewRequired(pr.state, ignoreNewCommits) &&
        isMuted(env, pr, muteConfiguration) === MutedResult.VISIBLE
    ),
    muted: enrichedPullRequests.filter(
      (pr) =>
        isReviewRequired(pr.state, ignoreNewCommits) &&
        isMuted(env, pr, muteConfiguration) === MutedResult.MUTED
    ),
    reviewed: enrichedPullRequests.filter(
      (pr) =>
        pr.state.kind === "incoming" &&
        !pr.state.newReviewRequested &&
        (!pr.state.newCommit || ignoreNewCommits) &&
        !pr.state.authorResponded
    ),
    mine: enrichedPullRequests.filter((pr) => pr.author.login === userLogin),
  };
}
