import { Filter } from "../filtering/filters";
import { Core } from "../state/core";
import { EnrichedPullRequest } from "../filtering/enriched-pull-request";
import { PullRequest } from "../storage/loaded-state";
import { MuteType } from "../storage/mute-configuration";

export interface CoreProps {
  core: Core;
}

export interface PopupState {
  currentFilter: Filter;
}

export interface PullRequestItemProps {
  pullRequest: EnrichedPullRequest;
  mutingConfiguration: "allow-muting" | "allow-unmuting" | "none";
  onOpen(pullRequestUrl: string): void;
  onMute(pullRequest: PullRequest, muteType: MuteType): void;
  onUnmute(pullRequest: PullRequest): void;
}

export interface PullRequestListProps {
  pullRequests: EnrichedPullRequest[] | null;
  emptyMessage: string;
  mutingConfiguration: "allow-muting" | "allow-unmuting" | "none";
  newCommitsNotificationToggled: boolean | null;
  onToggleNewCommitsNotification?(): void;
  onOpenAll(): void;
  onOpen(pullRequestUrl: string): void;
  onMute(pullRequest: PullRequest, muteType: MuteType): void;
  onUnmute(pullRequest: PullRequest): void;
}

export interface UpdateFormProps {
  title: string;
  openFunc(): void;
  desc: string;
}
