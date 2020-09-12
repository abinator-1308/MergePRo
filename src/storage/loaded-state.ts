export interface LoadedState {
  startRefreshTimestamp?: number;
  userLogin: string;
  avatarUrl: string;
}

export interface Repo {
  owner: string;
  name: string;
  pushedAt: string;
}
