import { observer } from "mobx-react-lite";
import React from "react";
import { Paragraph } from "./design/Paragraph";
import { Loader } from "./Loader";
import { PullRequestItem } from "./PullRequestItem";
import { PullRequestListProps } from "../interface";
import {
  NewCommitsCheckbox,
  NewCommitsToggle,
  List,
  StyledButton,
  StyledButtonToggle,
} from "./design/styled-pr-list";

export const PullRequestList = observer((props: PullRequestListProps) => (
  <List>
    {props.newCommitsNotificationToggled !== null && (
      <NewCommitsToggle>
        <NewCommitsCheckbox
          type="checkbox"
          checked={props.newCommitsNotificationToggled}
          onChange={props.onToggleNewCommitsNotification}
        />
        Turn Notifications on for New Commits
      </NewCommitsToggle>
    )}
    {props.pullRequests &&
      props.pullRequests.length > 1 &&
      (props.newCommitsNotificationToggled !== null ? (
        <StyledButtonToggle
          variant="outlined"
          color="primary"
          onClick={props.onOpenAll}
          href="https://github.com/notifications?query=is%3Aissue-or-pull-request++"
          size="small"
        >
          VIEW ALL
        </StyledButtonToggle>
      ) : (
        <StyledButton
          variant="outlined"
          color="primary"
          onClick={props.onOpenAll}
          href="https://github.com/notifications?query=is%3Aissue-or-pull-request++"
          size="small"
        >
          VIEW ALL
        </StyledButton>
      ))}
    {props.pullRequests === null ? (
      <Loader />
    ) : props.pullRequests.length === 0 ? (
      <Paragraph>{props.emptyMessage}</Paragraph>
    ) : (
      <>
        {props.pullRequests.map((pullRequest) => (
          <PullRequestItem
            key={pullRequest.nodeId}
            pullRequest={pullRequest}
            mutingConfiguration={props.mutingConfiguration}
            onOpen={props.onOpen}
            onMute={props.onMute}
            onUnmute={props.onUnmute}
          />
        ))}
      </>
    )}
  </List>
));
