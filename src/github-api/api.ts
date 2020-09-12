export interface GitHubApi {
  loadAuthenticatedUser(): Promise<GetAuthenticatedUserResponse>;
}

export interface GetAuthenticatedUserResponse {
  login: string;
  avatar_url: string;
}
