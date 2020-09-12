export interface LoadedState {
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
  requestedReviewers?: string[];
}
