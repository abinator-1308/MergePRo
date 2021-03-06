import { LoadedState } from "./loaded-state";
import { MuteConfiguration } from "./mute-configuration";

export interface Store {
  //Storage of the last error seen when fetching GitHub data
  lastError: ValueStorage<string | null>;

  //Storage of whether a refresh is happening in the background.

  currentlyRefreshing: ValueStorage<boolean>;

  /**
   * Storage of the currently muted pull requests.
   */
  muteConfiguration: ValueStorage<MuteConfiguration>;

  /**
   * Storage of the last information we loaded about pull requests.
   */
  lastCheck: ValueStorage<LoadedState | null>;

  //Storage of the user's provided GitHub token.
  token: ValueStorage<string | null>;

  notifiedPullRequests: ValueStorage<string[]>;
  /**
   * Storage of the last timestamp we requested the "tabs" permission.
   */
  lastRequestForTabsPermission: ValueStorage<number | null>;
}

export interface ValueStorage<T> {
  load(): Promise<T>;
  save(value: T | null): Promise<void>;
}
