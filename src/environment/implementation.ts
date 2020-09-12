import { ChromeApi } from "../chrome/api";
import { buildGitHubLoader } from "../loading/implementation";
import { buildMessenger } from "../messaging/implementation";
import { buildStore } from "../storage/implementation";
import { Environment } from "./api";

export function buildEnvironment(chromeApi: ChromeApi): Environment {
  const store = buildStore(chromeApi);
  const getCurrentTime = () => Date.now();

  return {
    store,
    githubLoader: buildGitHubLoader(),
    messenger: buildMessenger(chromeApi),
    getCurrentTime,
  };
}
