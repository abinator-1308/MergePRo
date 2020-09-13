import { PullRequest, ReviewState } from "../storage/loaded-state";
import { userPreviouslyReviewed } from "./reviewed";
import {
  getLastAuthorCommentTimestamp,
  getLastCommitTimestamp,
  getLastReviewOrCommentTimestamp,
} from "./timestamps";

export function pullRequestState(
  pr: PullRequest,
  currentUserLogin: string
): PullRequestState {
  if (pr.author.login === currentUserLogin) {
    return outgoingPullRequestState(pr, currentUserLogin);
  }
  if (
    !pr.reviewRequested &&
    !pr.userMentioned &&
    !userPreviouslyReviewed(pr, currentUserLogin)
  ) {
    return {
      kind: "not-involved",
      draft: pr.draft === true,
    };
  }
  return incomingPullRequestState(pr, currentUserLogin);
}

function incomingPullRequestState(
  pr: PullRequest,
  currentUserLogin: string
): PullRequestState {
  const lastReviewOrCommentFromCurrentUser = getLastReviewOrCommentTimestamp(
    pr,
    currentUserLogin
  );
  const hasNewCommentByAuthor =
    lastReviewOrCommentFromCurrentUser < getLastAuthorCommentTimestamp(pr);
  const hasNewCommit =
    lastReviewOrCommentFromCurrentUser < getLastCommitTimestamp(pr);
  const hasReviewed = lastReviewOrCommentFromCurrentUser > 0;
  return {
    kind: "incoming",
    draft: pr.draft === true,
    newReviewRequested: !hasReviewed,
    isUserMentioned: !hasReviewed,
    authorResponded: hasReviewed && hasNewCommentByAuthor,
    newCommit: hasReviewed && hasNewCommit,
  };
}

function outgoingPullRequestState(
  pr: PullRequest,
  currentUserLogin: string
): PullRequestState {
  const lastReviewOrCommentFromCurrentUserTimestamp = getLastReviewOrCommentTimestamp(
    pr,
    currentUserLogin
  );
  const lastCommitTimestamp = getLastCommitTimestamp(pr);
  const lastActionByCurrentUserTimestamp = Math.max(
    lastReviewOrCommentFromCurrentUserTimestamp,
    lastCommitTimestamp
  );
  const stateByUser = new Map<string, ReviewState>();

  // Keep track of the last known state of reviews left by others.
  for (const review of pr.reviews) {
    if (review.authorLogin === currentUserLogin) {
      continue;
    }
    const submittedAt = new Date(review.submittedAt).getTime();
    if (
      submittedAt < lastActionByCurrentUserTimestamp &&
      review.state === "CHANGES_REQUESTED"
    ) {
      // This change request may not be relevant anymore because the author has
      // taken action.
      stateByUser.set(review.authorLogin, "PENDING");
      continue;
    }
    // Set the user's current state to the current review. If it's a comment
    // however, we don't want to override a previous approval or request for
    // changes.
    if (!stateByUser.has(review.authorLogin) || review.state !== "COMMENTED") {
      stateByUser.set(review.authorLogin, review.state);
    }
  }

  // Ensure that anyone who commented without leaving a review is counted too.
  for (const comment of pr.comments) {
    if (comment.authorLogin === currentUserLogin) {
      continue;
    }
    if (!stateByUser.has(comment.authorLogin)) {
      stateByUser.set(comment.authorLogin, "COMMENTED");
    }
  }

  // Requested reviewers are specifically reviewers who haven't posted a review
  // after a request. This can also be the case when they had previously
  // reviewed, but the author requested another review from them.
  for (const requestedReviewer of pr.requestedReviewers || []) {
    stateByUser.set(requestedReviewer, "PENDING");
  }

  const states = new Set(stateByUser.values());
  return {
    kind: "outgoing",
    draft: pr.draft === true,
    noReviewers: stateByUser.size === 0,
    changesRequested: states.has("CHANGES_REQUESTED"),
    mergeable: pr.mergeable === true,
    approvedByEveryone: states.has("APPROVED") && states.size === 1,
  };
}

export type PullRequestState = IncomingState | NotInvolvedState | OutgoingState;

/**
 * The current user is involved in the PR, either because they are a reviewer or
 * because they've added comments.
 */
export interface IncomingState {
  kind: "incoming";
  draft: boolean;
  isUserMentioned: boolean;
  newReviewRequested: boolean;
  authorResponded: boolean;
  newCommit: boolean;
}

export interface NotInvolvedState {
  kind: "not-involved";
  draft: boolean;
}

export interface OutgoingState {
  kind: "outgoing";
  draft: boolean;
  noReviewers: boolean;
  changesRequested: boolean;
  mergeable: boolean;
  approvedByEveryone: boolean;
}

export function isReviewRequired(
  state: PullRequestState,
  ignoreNewCommits: boolean
) {
  return (
    state.kind === "incoming" &&
    (state.newReviewRequested ||
      state.isUserMentioned ||
      state.authorResponded ||
      (!ignoreNewCommits && state.newCommit))
  );
}
