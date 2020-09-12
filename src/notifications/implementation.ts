import { ChromeApi } from "../chrome/api";
import { EnrichedPullRequest } from "../filtering/enriched-pull-request";
import { Notifier } from "./api";

export const buildNotifier = (chromeApi: ChromeApi): Notifier => {
  return {
    notify(pullRequests, notifiedPullRequestUrls) {
      showNotificationForNewPullRequests(
        chromeApi,
        pullRequests,
        notifiedPullRequestUrls
      );
    },
    registerClickListener(clickListener: (pullRequestUrl: string) => void) {
      // Notification IDs are always pull request URLs (see below).
      chromeApi.notifications.onClicked.addListener((notificationId) => {
        clickListener(notificationId);
        chromeApi.notifications.clear(notificationId);
      });
    },
  };
};

const showNotificationForNewPullRequests = async (
  chromeApi: ChromeApi,
  pullRequests: EnrichedPullRequest[],
  notifiedPullRequestUrls: Set<string>
) => {
  for (const pullRequest of pullRequests) {
    if (!notifiedPullRequestUrls.has(pullRequest.htmlUrl)) {
      console.log(`Showing ${pullRequest.htmlUrl}`);
      return showNotification(chromeApi, pullRequest);
    } else {
      console.log(`Filtering ${pullRequest.htmlUrl}`);
      return;
    }
  }
};

const showNotification = (
  chromeApi: ChromeApi,
  pullRequest: EnrichedPullRequest
) => {
  const notificationId = pullRequest.htmlUrl;
  // Chrome supports requireInteraction, but it crashes Firefox.
  const supportsRequireInteraction =
    navigator.userAgent.toLowerCase().indexOf("firefox") === -1;

  return chromeApi.notifications.create(notificationId, {
    type: "basic",
    iconUrl: "images/GitHub-Mark-120px-plus.png",
    title: getTitle(pullRequest),
    message: getMessage(pullRequest),
    contextMessage: getContextMessage(pullRequest),
    ...(supportsRequireInteraction ? { requireInteraction: true } : {}),
  });
};

const getTitle = (pullRequest: EnrichedPullRequest): string => {
  switch (pullRequest.state.kind) {
    case "incoming":
      if (
        pullRequest.state.newReviewRequested ||
        pullRequest.state.isUserMentioned
      ) {
        return "New pull request";
      } else if (pullRequest.state.newCommit) {
        return `Pull request updated`;
      } else if (pullRequest.state.authorResponded) {
        return `${pullRequest.author.login} commented`;
      }
      break;

    case "outgoing":
      if (pullRequest.state.approvedByEveryone) {
        return `Pull request approved by everyone`;
      } else if (pullRequest.state.changesRequested) {
        return `New changes requested`;
      }
      break;
  }
  throw new Error(`Well, this should never happen.`);
};

const getMessage = (pullRequest: EnrichedPullRequest): string =>
  pullRequest.title;

const getContextMessage = (pullRequest: EnrichedPullRequest): string =>
  `${pullRequest.repoOwner}/${pullRequest.repoName}`;
