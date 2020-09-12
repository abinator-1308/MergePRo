import { PullRequestReference } from "../github-api/api";

export interface LoadedState {
  /**
   * The timestamp at which we started loading the state.
   *
   * Note that since loading the state can take a few minutes, this can be quite
   * different from the end time.
   */
  startRefreshTimestamp?: number;

  userLogin: string;
  avatarUrl: string;

  //The list of all open pull requests across all repositories.
  openPullRequests: PullRequest[];
}

export interface Repo {
  owner: string;
  name: string;
  pushedAt: string;
}

export function ref(pullRequest: PullRequest): PullRequestReference {
  return {
    repo: {
      owner: pullRequest.repoOwner,
      name: pullRequest.repoName,
    },
    number: pullRequest.pullRequestNumber,
  };
}

export interface PullRequest {
  nodeId: string;
  htmlUrl: string;
  repoOwner: string;
  repoName: string;
  pullRequestNumber: number;
  updatedAt: string;
  author: {
    login: string;
    avatarUrl: string;
  };
  title: string;
  draft?: boolean;
  mergeable?: boolean;
  reviewRequested: boolean;
  userMentioned: boolean;
  requestedReviewers?: string[];
  reviews: Review[];
  comments: Comment[];
  commits?: Commit[];
}

export interface Comment {
  authorLogin: string;
  createdAt: string;
}

export interface Review {
  authorLogin: string;
  state: ReviewState;
  submittedAt: string;
}

export interface Commit {
  authorLogin: string;
  createdAt: string;
}

export type ReviewState =
  | "PENDING"
  | "COMMENTED"
  | "CHANGES_REQUESTED"
  | "APPROVED";
