import { ChromeApi } from "../chrome/api";
import { Store } from "./api";
import {
  chromeValueStorage,
  chromeValueStorageWithDefault,
} from "./utils/chrome-value-storage";

export function buildStore(chromeApi: ChromeApi): Store {
  return {
    lastError: chromeValueStorage<string>(chromeApi, "error"),
    currentlyRefreshing: chromeValueStorageWithDefault<boolean>(
      chromeApi,
      "currentlyRefreshing",
      false
    ),
    token: chromeValueStorage<string>(chromeApi, "gitHubApiToken"),
  };
}
