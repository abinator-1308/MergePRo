import { observable } from "mobx";
import { Environment } from "../environment/api";
import { LoadedState } from "../storage/loaded-state";

export class Core {
  private readonly env: Environment;

  @observable overallStatus: "loading" | "loaded" = "loading";
  @observable refreshing: boolean = false;
  @observable token: string | null = null;
  @observable loadedState: LoadedState | null = null;
  @observable lastError: string | null = null;

  constructor(env: Environment) {
    this.env = env;
    this.env.messenger.listen((message) => {
      console.debug("Message received", message);
      if (message.kind === "reload") {
        this.load();
      }
    });
  }

  async load() {
    this.token = await this.env.store.token.load();
    if (this.token !== null) {
      this.refreshing = await this.env.store.currentlyRefreshing.load();
      this.lastError = await this.env.store.lastError.load();
    } else {
      this.refreshing = false;
      this.lastError = null;
      this.token = null;
      this.loadedState = null;
    }
    this.overallStatus = "loaded";
  }

  async setNewToken(token: string) {
    this.token = token;
    await this.env.store.token.save(token);
    await this.saveRefreshing(false);
    await this.saveError(null);
    await this.load();
    this.triggerBackgroundRefresh();
  }

  private async saveError(error: string | null) {
    this.lastError = error;
    await this.env.store.lastError.save(error);
  }

  private async saveRefreshing(refreshing: boolean) {
    this.refreshing = refreshing;
    await this.env.store.currentlyRefreshing.save(refreshing);
  }

  triggerBackgroundRefresh() {
    this.env.messenger.send({
      kind: "refresh",
    });
  }
}
