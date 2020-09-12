import { observer } from "mobx-react-lite";
import React from "react";
import { isRunningAsPopup } from "../popup-environment";
import { PullRequestItemProps } from "../interface";
import { PullRequestStatus } from "./PullRequestStatus";
import {
  AuthorAvatar,
  AuthorBox,
  PullRequestBox,
  AuthorLogin,
  Info,
  Title,
  Repo,
} from "./design/styled-pull-request";

export const PullRequestItem = observer((props: PullRequestItemProps) => {
  const open = (e: React.MouseEvent) => {
    props.onOpen(props.pullRequest.htmlUrl);
    e.preventDefault();
  };

  return (
    <PullRequestBox
      key={props.pullRequest.nodeId}
      onClick={isRunningAsPopup() ? open : undefined}
      href={props.pullRequest.htmlUrl}
    >
      <Info>
        <Title>{props.pullRequest.title}</Title>
        <PullRequestStatus pullRequest={props.pullRequest} />
        <Repo>
          {props.pullRequest.repoOwner}/{props.pullRequest.repoName} (#
          {props.pullRequest.pullRequestNumber})
        </Repo>
      </Info>
      <AuthorBox title={props.pullRequest.author.login}>
        {props.pullRequest.author && (
          <AuthorAvatar src={props.pullRequest.author.avatarUrl} />
        )}
        <AuthorLogin>{props.pullRequest.author.login}</AuthorLogin>
      </AuthorBox>
    </PullRequestBox>
  );
});
