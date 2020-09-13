import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React from "react";
import { Dropdown } from "react-bootstrap";
import { isRunningAsPopup } from "../popup-environment";
import { MuteType } from "../storage/mute-configuration";
import { SmallButton } from "./design/Button";
import { PullRequestStatus } from "./PullRequestStatus";
import { PullRequestItemProps } from "../interface";
import {
  Icon,
  InlineDropdown,
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

  const preventDefault = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const createMuteHandler = (muteType: MuteType) => {
    return () => {
      props.onMute(props.pullRequest, muteType);
    };
  };

  const unmute = (e: React.MouseEvent) => {
    props.onUnmute(props.pullRequest);
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <PullRequestBox
      key={props.pullRequest.nodeId}
      onClick={isRunningAsPopup() ? open : undefined}
      href={props.pullRequest.htmlUrl}
    >
      <Info>
        <Title>
          {props.pullRequest.title}
          {props.mutingConfiguration === "allow-muting" && (
            <InlineDropdown onClick={preventDefault} alignRight>
              <Dropdown.Toggle
                as={SmallButton}
                id={`mute-dropdown-${props.pullRequest.nodeId}`}
              >
                <FontAwesomeIcon icon="bell-slash" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onSelect={createMuteHandler("next-comment-by-author")}
                >
                  <Icon icon="reply" />
                  Mute till Author's new comment
                </Dropdown.Item>
                <Dropdown.Item onSelect={createMuteHandler("next-update")}>
                  <Icon icon="podcast" />
                  Next update
                </Dropdown.Item>
                {props.pullRequest.draft && (
                  <Dropdown.Item onSelect={createMuteHandler("not-draft")}>
                    <Icon icon="pen" />
                    Not draft
                  </Dropdown.Item>
                )}
                <Dropdown.Item onSelect={createMuteHandler("1-hour")}>
                  <Icon icon="clock" />1 hour
                </Dropdown.Item>
                <Dropdown.Item onSelect={createMuteHandler("forever")}>
                  <Icon icon="ban" />
                  Mute permanently
                </Dropdown.Item>
                <Dropdown.Item onSelect={createMuteHandler("repo")}>
                  Ignore all PRs in{" "}
                  <b>{`${props.pullRequest.repoOwner}/${props.pullRequest.repoName}`}</b>
                </Dropdown.Item>
                <Dropdown.Item onSelect={createMuteHandler("owner")}>
                  Ignore all Repositories owned by{" "}
                  <b>{props.pullRequest.repoOwner}</b>
                </Dropdown.Item>
              </Dropdown.Menu>
            </InlineDropdown>
          )}
          {props.mutingConfiguration === "allow-unmuting" && (
            <SmallButton title="Unmute" onClick={unmute}>
              <FontAwesomeIcon icon="bell" />
            </SmallButton>
          )}
        </Title>
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
