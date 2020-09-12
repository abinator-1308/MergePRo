import { ChromeApi } from "../chrome/api";
import { buildGitHubLoader } from "../loading/implementation";
import { buildStore } from "../storage/implementation";
import { Environment } from "./api";

export function buildEnvironment(chromeApi: ChromeApi): Environment {
  const store = buildStore(chromeApi);

  return {
    store,
    githubLoader: buildGitHubLoader(),
  };
}
