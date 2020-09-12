import { Octokit } from "@octokit/rest";

export interface GitHubApi {
  // load user details
  loadAuthenticatedUser(): Promise<GetAuthenticatedUserResponse>;

  //search pull request
  searchPullRequests(query: string): Promise<PullsSearchResponse>;

  // load particular pull request
  loadPullRequestDetails(
    pr: PullRequestReference
  ): Promise<Octokit.PullsGetResponse>;
}

export interface GetAuthenticatedUserResponse {
  login: string;
  avatar_url: string;
}

export interface RepoReference {
  owner: string;
  name: string;
}

export interface PullRequestReference {
  repo: RepoReference;
  number: number;
}

export type PullsSearchResponse = PullsSearchResponseItem[];

export interface PullsSearchResponseItem {
  node_id: string;
  created_at: string;
  updated_at: string;
  title: string;
  number: number;
  draft: boolean;
  user: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  repository_url: string;
}
