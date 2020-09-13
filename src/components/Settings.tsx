import styled from "@emotion/styled";
import { observer } from "mobx-react-lite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FormEvent, useRef, useState } from "react";
import { CoreProps } from "../interface";
import { Button, Tooltip, Zoom } from "@material-ui/core";
import { Link } from "./design/Link";
import { Paragraph } from "./design/Paragraph";
import { Row } from "./design/Row";
import { UpdateForm } from "./UpdateForm";
import { isRunningAsPopup } from "../popup-environment";
import { Visibility, AddToQueue, Refresh } from "@material-ui/icons";

const TokenInput = styled.input`
  flex-grow: 1;
  padding: 4px 8px;
  margin-right: 8px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji;

  &:focus {
    outline-color: #2ee59d;
  }
`;

const FullScreenLink = styled(Link)`
  opacity: 0.7;
  border-radius: 25px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji;
  &:hover {
    opacity: 1;
  }
`;

const chromeRunTimeId = "glecejlpeilpjhbimjhdhajapnbaljla";

export const Settings = observer((props: CoreProps) => {
  const [state, setState] = useState<{
    editing: boolean | "default";
  }>({
    editing: "default",
  });

  const inputRef = useRef<HTMLInputElement>(null);

  // Show the token editing form if:
  // - editing is "default" (user has not said whether they want to open or dismiss the form)
  //   AND the token is not set; or
  // - editing is explicitly set to true (user opened the form).
  const editing =
    state.editing === "default" ? !props.core.token : state.editing;

  const openForm = () => {
    setState({
      editing: true,
    });
  };

  const saveForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputRef.current) {
      return;
    }
    const token = inputRef.current.value;
    props.core
      .setNewToken(token)
      .then(() => console.log("GitHub API token updated."));
    setState({
      editing: false,
    });
  };

  const cancelForm = () => {
    setState({
      editing: false,
    });
  };

  return (
    <>
      {!editing ? (
        props.core.loadedState ? (
          <Row>
            <Paragraph>
              <Link
                onClick={() =>
                  window.open("https://github.com/notifications/subscriptions")
                }
                color="inherit"
              >
                <Tooltip
                  title="Github Subscriptions"
                  TransitionComponent={Zoom}
                  arrow
                >
                  <AddToQueue />
                </Tooltip>
              </Link>

              <Link
                onClick={() => window.open("https://github.com/watching")}
                color="inherit"
              >
                <Tooltip
                  title="Github Watchlist"
                  TransitionComponent={Zoom}
                  arrow
                >
                  <Visibility />
                </Tooltip>
              </Link>
              <Link
                onClick={() => props.core.triggerBackgroundRefresh()}
                color="inherit"
              >
                <Tooltip title="Refresh" TransitionComponent={Zoom} arrow>
                  <Refresh />
                </Tooltip>
              </Link>
              {!isRunningAsPopup && (
                <FullScreenLink
                  target="_blank"
                  href={`chrome-extension://${chromeRunTimeId}/index.html`}
                >
                  <FontAwesomeIcon icon="clone" />
                </FullScreenLink>
              )}
            </Paragraph>
            <UpdateForm title="Update token" desc="" openFunc={openForm} />
          </Row>
        ) : props.core.lastError ? (
          <Row>
            <UpdateForm
              title="Update token"
              desc="Is your token valid?"
              openFunc={openForm}
            />
          </Row>
        ) : props.core.token ? (
          <Row>
            <UpdateForm
              title="Update token"
              desc=" Loading your pull requests. This could take a while..."
              openFunc={openForm}
            />
          </Row>
        ) : (
          <UpdateForm
            title="Update token"
            desc=" 
            Hi Developer! Add a Github API token to start MergePRo."
            openFunc={openForm}
          />
        )
      ) : (
        <form onSubmit={saveForm}>
          {!props.core.token && (
            <Paragraph>
              Hi Developer! Add a Github API token to start MergePRo.
            </Paragraph>
          )}
          <Paragraph>
            Enter a GitHub API token with <b>repo</b> scope (
            <Link
              href="https://github.com/settings/tokens/new?description=PR%20Monitor&amp;scopes=repo"
              target="_blank"
            >
              create a new one
            </Link>
            ):
          </Paragraph>
          <Row>
            <TokenInput ref={inputRef} />
            <Button
              variant="outlined"
              color="secondary"
              type="submit"
              size="small"
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={cancelForm}
              size="small"
            >
              Cancel
            </Button>
          </Row>
        </form>
      )}
    </>
  );
});
