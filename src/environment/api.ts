import { GitHubLoader } from "../loading/api";
import { Store } from "../storage/api";

export interface Environment {
  store: Store;
  githubLoader: GitHubLoader;
}
