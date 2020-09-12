export interface GitHubApi {
  loadAuthenticatedUser(): Promise<GetAuthenticatedUserResponse>;
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
