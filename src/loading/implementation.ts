import { buildGitHubApi } from "../github-api/implementation";
import { LoadedState } from "../storage/loaded-state";
import { GitHubLoader } from "./api";

export function buildGitHubLoader(): GitHubLoader {
  return load;
}

async function load(token: string): Promise<LoadedState> {
  const githubApi = buildGitHubApi(token);
  const user = await githubApi.loadAuthenticatedUser();

  return {
    userLogin: user.login,
    avatarUrl: user.avatar_url,
  };
}
