import { ChromeApi } from "../chrome/api";
import { Store } from "./api";
import {
  chromeValueStorage,
  chromeValueStorageWithDefault,
} from "./utils/chrome-value-storage";
import { LoadedState } from "./loaded-state";

export function buildStore(chromeApi: ChromeApi): Store {
  return {
    lastError: chromeValueStorage<string>(chromeApi, "error"),
    lastCheck: chromeValueStorage<LoadedState>(chromeApi, "lastCheck"),
    currentlyRefreshing: chromeValueStorageWithDefault<boolean>(
      chromeApi,
      "currentlyRefreshing",
      false
    ),
    token: chromeValueStorage<string>(chromeApi, "gitHubApiToken"),
    lastRequestForTabsPermission: chromeValueStorage<number>(
      chromeApi,
      "lastRequestForTabsPermission"
    ),
  };
}
