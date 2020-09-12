import { PullRequest } from "../storage/loaded-state";

export function userPreviouslyReviewed(
  pr: PullRequest,
  currentUserLogin: string
): boolean {
  return (
    (pr.comments || []).findIndex((r) => r.authorLogin === currentUserLogin) !==
      -1 ||
    pr.reviews.findIndex((r) => r.authorLogin === currentUserLogin) !== -1
  );
}
