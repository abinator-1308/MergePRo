import { GitHubLoader } from "../loading/api";
import { CrossScriptMessenger } from "../messaging/api";
import { Store } from "../storage/api";
import { TabOpener } from "../tabs/api";

export interface Environment {
  store: Store;
  githubLoader: GitHubLoader;
  messenger: CrossScriptMessenger;
  tabOpener: TabOpener;
  getCurrentTime(): number;
  isOnline(): boolean;
}
