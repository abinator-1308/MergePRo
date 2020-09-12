import { GitHubLoader } from "../loading/api";
import { CrossScriptMessenger } from "../messaging/api";
import { Store } from "../storage/api";
import { TabOpener } from "../tabs/api";
import { Badger } from "../badge/api";

export interface Environment {
  store: Store;
  githubLoader: GitHubLoader;
  messenger: CrossScriptMessenger;
  tabOpener: TabOpener;
  badger: Badger;
  getCurrentTime(): number;
  isOnline(): boolean;
}
