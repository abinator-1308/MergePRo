import { Octokit } from "@octokit/rest";
import {
  GitHubApi,
  PullRequestReference,
  PullsSearchResponseItem,
  RepoReference,
} from "../../github-api/api";
import {
  Comment,
  Commit,
  PullRequest,
  Review,
} from "../../storage/loaded-state";

export async function refreshOpenPullRequests(
  githubApi: GitHubApi,
  userLogin: string
): Promise<PullRequest[]> {
  // Note: each query should specifically exclude the previous ones so we don't end up having
  // to deduplicate PRs across lists.
  const reviewRequestedPullRequests = await githubApi.searchPullRequests(
    `review-requested:${userLogin} -author:${userLogin} is:open archived:false`
  );
  const mentionedPullRequests = await githubApi.searchPullRequests(
    `mentions:${userLogin} -author:${userLogin} is:open archived:false`
  );
  const commentedPullRequests = await githubApi.searchPullRequests(
    `commenter:${userLogin} -author:${userLogin} -review-requested:${userLogin} is:open archived:false`
  );
  const ownPullRequests = await githubApi.searchPullRequests(
    `author:${userLogin} is:open archived:false`
  );

  return Promise.all([
    ...reviewRequestedPullRequests.map((pr) =>
      updateCommentsAndReviews(githubApi, pr, false, true)
    ),
    ...mentionedPullRequests.map((pr) =>
      updateCommentsAndReviews(githubApi, pr, true, false)
    ),
    ...commentedPullRequests.map((pr) =>
      updateCommentsAndReviews(githubApi, pr)
    ),
    ...ownPullRequests.map((pr) => updateCommentsAndReviews(githubApi, pr)),
  ]);
}

async function updateCommentsAndReviews(
  githubApi: GitHubApi,
  rawPullRequest: PullsSearchResponseItem,
  userMentioned = false,
  isReviewRequested = false
): Promise<PullRequest> {
  const repo = extractRepo(rawPullRequest);
  const pr: PullRequestReference = {
    repo,
    number: rawPullRequest.number,
  };
  const [
    freshPullRequestDetails,
    freshReviews,
    freshComments,
    freshCommits,
  ] = await Promise.all([
    githubApi.loadPullRequestDetails(pr),
    githubApi.loadReviews(pr).then((reviews) =>
      reviews.map((review) => ({
        authorLogin: review.user.login,
        state: review.state,
        submittedAt: review.submitted_at,
      }))
    ),
    githubApi.loadComments(pr).then((comments) =>
      comments.map((comment) => ({
        authorLogin: comment.user.login,
        createdAt: comment.created_at,
      }))
    ),
    githubApi.loadCommits(pr).then((commits) =>
      commits.map((commit) => ({
        authorLogin: commit.author ? commit.author.login : "",
        createdAt: commit.commit.author.date,
      }))
    ),
  ]);
  return pullRequestFromResponse(
    rawPullRequest,
    freshPullRequestDetails,
    freshReviews,
    freshComments,
    freshCommits,
    userMentioned,
    isReviewRequested
  );
}

function pullRequestFromResponse(
  response: PullsSearchResponseItem,
  details: Octokit.PullsGetResponse,
  reviews: Review[],
  comments: Comment[],
  commits: Commit[],
  userMentioned: boolean,
  reviewRequested: boolean
): PullRequest {
  const repo = extractRepo(response);

  return {
    nodeId: response.node_id,
    htmlUrl: response.html_url,
    repoOwner: repo.owner,
    repoName: repo.name,
    pullRequestNumber: response.number,
    updatedAt: response.updated_at,
    author: {
      login: response.user.login,
      avatarUrl: response.user.avatar_url,
    },
    title: response.title,
    draft: response.draft,
    mergeable: details.mergeable,
    reviewRequested,
    userMentioned,
    requestedReviewers: details.requested_reviewers.map(
      (reviewer) => reviewer.login
    ),
    reviews,
    comments,
    commits,
  };
}

function extractRepo(response: PullsSearchResponseItem): RepoReference {
  const urlParts = response.repository_url.split("/");
  if (urlParts.length < 2) {
    throw new Error(`Unexpected repository_url: ${response.repository_url}`);
  }
  return {
    owner: urlParts[urlParts.length - 2],
    name: urlParts[urlParts.length - 1],
  };
}
