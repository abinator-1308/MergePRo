import { computed, observable } from "mobx";
import { Environment } from "../environment/api";
import { LoadedState } from "../storage/loaded-state";
import { BadgeState } from "../badge/api";
import { EnrichedPullRequest } from "../filtering/enriched-pull-request";
import {
  Filter,
  FilteredPullRequests,
  filterPullRequests,
} from "../filtering/filters";
import { NOTHING_MUTED } from "../storage/mute-configuration";

export class Core {
  private readonly env: Environment;

  @observable overallStatus: "loading" | "loaded" = "loading";
  @observable refreshing: boolean = false;
  @observable token: string | null = null;
  @observable loadedState: LoadedState | null = null;
  @observable lastError: string | null = null;
  @observable muteConfiguration = NOTHING_MUTED;


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
      this.loadedState = await this.env.store.lastCheck.load();
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
    await this.saveLoadedState(null);
    await this.load();
    this.triggerBackgroundRefresh();
  }

  async refreshPullRequests() {
    if (!this.token) {
      console.debug("Not authenticated, skipping refresh.");
      return;
    }
    if (!this.env.isOnline()) {
      console.debug("Not online, skipping refresh.");
      return;
    }
    await this.saveRefreshing(true);
    await this.triggerReload();
    try {
      const startRefreshTimestamp = this.env.getCurrentTime();
      await this.saveLoadedState({
        startRefreshTimestamp,
        ...(await this.env.githubLoader(this.token, this.loadedState)),
      });
      const notifyAboutPullRequests = [
        ...(this.unreviewedPullRequests || []),
        ...(this.actionRequiredOwnPullRequests || []),
      ];
      this.saveError(null);
    } catch (e) {
      this.saveError(e.message);
      throw e;
    } finally {
      await this.saveRefreshing(false);
      this.triggerReload();
    }
  }

  async openPullRequest(pullRequestUrl: string) {
    await this.env.tabOpener.openPullRequest(pullRequestUrl);
  }

  @computed
  get filteredPullRequests(): FilteredPullRequests | null {
    const lastCheck = this.loadedState;
    if (!lastCheck || !lastCheck.userLogin) {
      return null;
    }
    return filterPullRequests(
      this.env,
      lastCheck.userLogin,
      lastCheck.openPullRequests,
    );
  }

  @computed
  get unreviewedPullRequests(): EnrichedPullRequest[] | null {
    return this.filteredPullRequests
      ? this.filteredPullRequests[Filter.INCOMING]
      : null;
  }

  @computed
  get actionRequiredOwnPullRequests(): EnrichedPullRequest[] | null {
    return this.filteredPullRequests
      ? this.filteredPullRequests[Filter.MINE].filter(
          (pr) =>
            pr.state.kind === "outgoing" &&
            (pr.state.approvedByEveryone || pr.state.changesRequested)
        )
      : null;
  }

  private updateBadge() {
    let badgeState: BadgeState;
    const unreviewedPullRequests = this.unreviewedPullRequests;
    if (this.lastError || !this.token) {
      badgeState = {
        kind: "error",
      };
    } else if (!unreviewedPullRequests) {
      badgeState = {
        kind: "initializing",
      };
    } else if (this.refreshing) {
      badgeState = {
        kind: "reloading",
        unreviewedPullRequestCount: unreviewedPullRequests.length,
      };
    } else {
      badgeState = {
        kind: "loaded",
        unreviewedPullRequestCount: unreviewedPullRequests.length,
      };
    }
    this.env.badger.update(badgeState);
  }

  private async saveError(error: string | null) {
    this.lastError = error;
    await this.env.store.lastError.save(error);
  }

  private async saveRefreshing(refreshing: boolean) {
    this.refreshing = refreshing;
    await this.env.store.currentlyRefreshing.save(refreshing);
  }

  private async saveLoadedState(lastCheck: LoadedState | null) {
    this.loadedState = lastCheck;
    await this.env.store.lastCheck.save(lastCheck);
  }

  triggerBackgroundRefresh() {
    this.env.messenger.send({
      kind: "refresh",
    });

    if (process.env.NODE_ENV === "development") {
      this.refreshPullRequests().catch(console.error);
    }
  }

  private triggerReload() {
    this.env.messenger.send({
      kind: "reload",
    });
  }
}
