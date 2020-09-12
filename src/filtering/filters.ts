import { Environment } from "../environment/api";
import { PullRequest } from "../storage/loaded-state";
import { EnrichedPullRequest } from "./enriched-pull-request";
import { isReviewRequired, pullRequestState } from "./status";

export enum Filter {
  // contains requested review and mentioned PRs
  INCOMING = "incoming",
  REVIEWED = "reviewed",
  MINE = "mine",
}

export type FilteredPullRequests = {
  [filter in Filter]: EnrichedPullRequest[];
};

export function filterPullRequests(
  env: Environment,
  userLogin: string,
  openPullRequests: PullRequest[]
): FilteredPullRequests {
  const enrichedPullRequests = openPullRequests.map((pr) => ({
    state: pullRequestState(pr, userLogin),
    ...pr,
  }));
  return {
    incoming: enrichedPullRequests.filter((pr) => isReviewRequired(pr.state)),
    reviewed: enrichedPullRequests.filter(
      (pr) =>
        pr.state.kind === "incoming" &&
        !pr.state.newReviewRequested &&
        !pr.state.isUserMentioned &&
        !pr.state.authorResponded
    ),
    mine: enrichedPullRequests.filter((pr) => pr.author.login === userLogin),
  };
}
