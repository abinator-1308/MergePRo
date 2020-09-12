import { LoadedState } from "../storage/loaded-state";

export type GitHubLoader = (
  token: string,
  lastCheck: LoadedState | null
) => Promise<LoadedState>;
