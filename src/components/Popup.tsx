import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { Badge, Tab, Tabs } from "react-bootstrap";
import { Filter } from "../filtering/filters";
import { Row } from "./design/Row";
import { Loader } from "./Loader";
import { PullRequestList } from "./PullRequestList";
import { Settings } from "./Settings";
import { CoreProps, PopupState } from "../interface";
import { REALTIME_UPDATE_INTERVAL } from "../constants";
import { StyledAppBar } from "./AppBar";

export const Popup = observer((props: CoreProps) => {
  const [state, setState] = useState<PopupState>({
    currentFilter: Filter.INCOMING,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      props.core.triggerBackgroundRefresh();
    }, REALTIME_UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const onOpenAll = () => {
    const pullRequests = props.core.filteredPullRequests
      ? props.core.filteredPullRequests[state.currentFilter]
      : [];
    for (const pullRequest of pullRequests) {
      onOpen(pullRequest.htmlUrl);
    }
  };

  const onOpen = (pullRequestUrl: string) => {
    props.core.openPullRequest(pullRequestUrl).catch(console.error);
  };

  if (props.core.overallStatus !== "loaded") {
    return <Loader />;
  }

  return (
    <>
      <Row>
        <StyledAppBar core={props.core} />
      </Row>
      {props.core.token &&
        // Don't show the list if there was an error, we're not refreshing
        // anymore (because of the error) and we don't have any loaded state.
        !(
          props.core.lastError &&
          !props.core.refreshing &&
          !props.core.loadedState
        ) && (
          <>
            <Tabs
              id="popup-tabs"
              activeKey={state.currentFilter}
              onSelect={(key: string | null) =>
                setState({ currentFilter: key as Filter })
              }
            >
              <Tab
                title={
                  <>
                    Designated{" "}
                    {props.core.filteredPullRequests && (
                      <Badge
                        variant={
                          props.core.filteredPullRequests.incoming.length > 0
                            ? "danger"
                            : "secondary"
                        }
                      >
                        {props.core.filteredPullRequests.incoming.length}
                      </Badge>
                    )}
                  </>
                }
                eventKey={Filter.INCOMING}
              />
              <Tab
                title={
                  <>
                    Reviewed{" "}
                    {props.core.filteredPullRequests && (
                      <Badge variant="secondary">
                        {props.core.filteredPullRequests.reviewed.length}
                      </Badge>
                    )}
                  </>
                }
                eventKey={Filter.REVIEWED}
              />
              <Tab
                title={
                  <>
                    Requested{" "}
                    {props.core.filteredPullRequests && (
                      <Badge variant="secondary">
                        {props.core.filteredPullRequests.mine.length}
                      </Badge>
                    )}
                  </>
                }
                eventKey={Filter.MINE}
              />
            </Tabs>
            <PullRequestList
              pullRequests={
                props.core.filteredPullRequests
                  ? props.core.filteredPullRequests[state.currentFilter]
                  : null
              }
              emptyMessage={
                state.currentFilter === Filter.INCOMING
                  ? `No PRs to review, yay!`
                  : `No PRs here!`
              }
              onOpenAll={onOpenAll}
              onOpen={onOpen}
            />
          </>
        )}
      <Settings core={props.core} />
    </>
  );
});
