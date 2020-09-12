import { Filter } from "../filtering/filters";
import { Core } from "../state/core";
import { EnrichedPullRequest } from "../filtering/enriched-pull-request";

export interface CoreProps {
  core: Core;
}

export interface PopupState {
  currentFilter: Filter;
}

export interface PullRequestItemProps {
  pullRequest: EnrichedPullRequest;
  onOpen(pullRequestUrl: string): void;
}

export interface PullRequestListProps {
  pullRequests: EnrichedPullRequest[] | null;
  emptyMessage: string;
  onOpenAll(): void;
  onOpen(pullRequestUrl: string): void;
}

export interface UpdateFormProps {
  title: string;
  openFunc(): void;
  desc: string;
}
