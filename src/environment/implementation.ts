import { ChromeApi } from "../chrome/api";
import { buildGitHubLoader } from "../loading/implementation";
import { buildMessenger } from "../messaging/implementation";
import { buildStore } from "../storage/implementation";
import { buildBadger } from "../badge/implementation";
import { buildTabOpener } from "../tabs/implementation";
import { Environment } from "./api";

export function buildEnvironment(chromeApi: ChromeApi): Environment {
  const store = buildStore(chromeApi);
  const getCurrentTime = () => Date.now();

  return {
    store,
    githubLoader: buildGitHubLoader(),
    messenger: buildMessenger(chromeApi),
    badger: buildBadger(chromeApi),
    tabOpener: buildTabOpener(chromeApi, store, getCurrentTime),
    getCurrentTime,
    isOnline: () => navigator.onLine,
  };
}
