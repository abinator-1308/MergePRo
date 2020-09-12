import { GitHubLoader } from "../loading/api";
import { CrossScriptMessenger } from "../messaging/api";
import { Store } from "../storage/api";

export interface Environment {
  store: Store;
  githubLoader: GitHubLoader;
  messenger: CrossScriptMessenger;
  getCurrentTime(): number;
}
