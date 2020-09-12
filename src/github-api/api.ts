import { Octokit } from "@octokit/rest";
import { ReviewState } from "../storage/loaded-state";

export interface GitHubApi {
  // load user details
  loadAuthenticatedUser(): Promise<GetAuthenticatedUserResponse>;

  //search pull request
  searchPullRequests(query: string): Promise<PullsSearchResponse>;

  // load particular pull request
  loadPullRequestDetails(
    pr: PullRequestReference
  ): Promise<Octokit.PullsGetResponse>;

  //load pr reviews
  loadReviews(pr: PullRequestReference): Promise<PullsListReviewsResponse>;

  // load pr comments
  loadComments(
    pr: PullRequestReference
  ): Promise<Octokit.IssuesListCommentsResponse>;

  // load pr commits
  loadCommits(
    pr: PullRequestReference
  ): Promise<Octokit.PullsListCommitsResponse>;
}

export interface RepoReference {
  owner: string;
  name: string;
}

export interface PullRequestReference {
  repo: RepoReference;
  number: number;
}

export interface GetAuthenticatedUserResponse {
  login: string;
  avatar_url: string;
}

export type PullsListReviewsResponse = PullsListReviewsResponseItem[];

export interface PullsListReviewsResponseItem
  extends Octokit.PullsListReviewsResponseItem {
  state: ReviewState;
  submitted_at: string;
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
