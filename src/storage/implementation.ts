import { ChromeApi } from "../chrome/api";
import { Store } from "./api";
import {
  chromeValueStorage,
  chromeValueStorageWithDefault,
} from "./utils/chrome-value-storage";
import { LoadedState } from "./loaded-state";
import { NOTHING_MUTED } from "./mute-configuration";

export function buildStore(chromeApi: ChromeApi): Store {
  return {
    lastError: chromeValueStorage<string>(chromeApi, "error"),
    lastCheck: chromeValueStorage<LoadedState>(chromeApi, "lastCheck"),
    currentlyRefreshing: chromeValueStorageWithDefault<boolean>(
      chromeApi,
      "currentlyRefreshing",
      false
    ),
    muteConfiguration: chromeValueStorageWithDefault(
      chromeApi,
      "mute",
      NOTHING_MUTED
    ),
    token: chromeValueStorage<string>(chromeApi, "gitHubApiToken"),
    notifiedPullRequests: chromeValueStorageWithDefault<string[]>(
      chromeApi,
      "lastSeenPullRequests",
      []
    ),
    lastRequestForTabsPermission: chromeValueStorage<number>(
      chromeApi,
      "lastRequestForTabsPermission"
    ),
  };
}
