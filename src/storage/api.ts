export interface Store {
  //Storage of the last error seen when fetching GitHub data
  lastError: ValueStorage<string | null>;

  //Storage of whether a refresh is happening in the background.

  currentlyRefreshing: ValueStorage<boolean>;

  //Storage of the user's provided GitHub token.
  token: ValueStorage<string | null>;
}

export interface ValueStorage<T> {
  load(): Promise<T>;
  save(value: T | null): Promise<void>;
}
