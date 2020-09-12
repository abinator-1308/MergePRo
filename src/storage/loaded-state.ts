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
}

export interface Repo {
  owner: string;
  name: string;
  pushedAt: string;
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
  /**
   * Whether a review is requested from the current user.
   */
  reviewRequested: boolean;
  /**
   * List of reviewers who are yet to review the PR (or who were requested to review again).
   */
  // TODO: Make this required in September 2019.
  requestedReviewers?: string[];
  reviews: Review[];
  comments: Comment[];
  commits?: Commit[];
}

export type ReviewState =
  | "PENDING"
  | "COMMENTED"
  | "CHANGES_REQUESTED"
  | "APPROVED";