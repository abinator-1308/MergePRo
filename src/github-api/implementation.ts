import { Octokit } from "@octokit/rest";
import { throttling } from "@octokit/plugin-throttling";
import { GitHubApi } from "./api";

const ThrottledOctokit = Octokit.plugin(throttling as any);

interface ThrottlingOptions {
  method: string;
  url: string;
  request: {
    retryCount: number;
  };
}

export function buildGitHubApi(token: string): GitHubApi {
  const octokit = new ThrottledOctokit({
    auth: `token ${token}`,

    // Enable Draft Pull Request API.
    previews: ["shadow-cat"],
    throttle: {
      onRateLimit: (retryAfterSeconds: number, options: ThrottlingOptions) => {
        console.warn(
          `Request quota exhausted for request ${options.method} ${options.url}`
        );
        // Only retry twice.
        if (options.request.retryCount < 2) {
          console.log(`Retrying after ${retryAfterSeconds} seconds!`);
          return true;
        }
        return false;
      },
      onAbuseLimit: (
        _retryAfterSeconds: number,
        options: ThrottlingOptions
      ) => {
        // Does not retry, only logs a warning.
        console.warn(
          `Abuse detected for request ${options.method} ${options.url}`
        );
        return false;
      },
    },
  });
  return {
    async loadAuthenticatedUser() {
      const response = await octokit.users.getAuthenticated({});
      return response.data;
    },
  };
}
