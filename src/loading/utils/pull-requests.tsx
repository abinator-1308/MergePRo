import { Octokit } from "@octokit/rest";
import {
  GitHubApi,
  PullRequestReference,
  PullsSearchResponseItem,
  RepoReference,
} from "../../github-api/api";
import { PullRequest } from "../../storage/loaded-state";

//Refreshes the list of pull requests for a list of repositories.
export async function refreshOpenPullRequests(
  githubApi: GitHubApi,
  userLogin: string
): Promise<PullRequest[]> {
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
      updateCommentsAndReviews(githubApi, pr, true)
    ),
    ...mentionedPullRequests.map((pr) =>
      updateCommentsAndReviews(githubApi, pr, true)
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
  isReviewRequested = false
): Promise<PullRequest> {
  const repo = extractRepo(rawPullRequest);
  const pr: PullRequestReference = {
    repo,
    number: rawPullRequest.number,
  };
  const [freshPullRequestDetails] = await Promise.all([
    githubApi.loadPullRequestDetails(pr),
  ]);
  return pullRequestFromResponse(
    rawPullRequest,
    freshPullRequestDetails,
    isReviewRequested
  );
}

function pullRequestFromResponse(
  response: PullsSearchResponseItem,
  details: Octokit.PullsGetResponse,
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
    requestedReviewers: details.requested_reviewers.map(
      (reviewer) => reviewer.login
    ),
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
