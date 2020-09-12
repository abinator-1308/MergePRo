import React from "react";
import { observer } from "mobx-react-lite";
import { CoreProps } from "../interface";
import {
  AuthorAvatar,
  StyledTypography,
  StyledTooltip,
} from "./design/styled-popup";
import { BarChart, ErrorOutline, CheckCircleOutline } from "@material-ui/icons";
import { Typography, AppBar, Toolbar, Zoom } from "@material-ui/core";

export const StyledAppBar = observer((props: CoreProps) => (
  <AppBar position="static" style={{ background: "#24292e" }}>
    <Toolbar variant="dense">
      <Typography
        variant="h6"
        font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,
            Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji"
      >
        MergePRo
      </Typography>
      {props.core.lastError ? (
        <StyledTooltip
          title={`Error: ${props.core.lastError}`}
          TransitionComponent={Zoom}
          placement="right"
          arrow
        >
          <ErrorOutline color="error" />
        </StyledTooltip>
      ) : props.core.refreshing ? (
        <StyledTooltip
          title="Loading..."
          TransitionComponent={Zoom}
          placement="right"
          arrow
        >
          <BarChart color="inherit" />
        </StyledTooltip>
      ) : (
        props.core.loadedState && (
          <StyledTooltip
            title="Welcome to MergePRo!"
            TransitionComponent={Zoom}
            placement="right"
            arrow
          >
            <CheckCircleOutline style={{ color: "green" }} />
          </StyledTooltip>
        )
      )}

      {props.core.loadedState && (
        <AuthorAvatar src={props.core.loadedState.avatarUrl} />
      )}
      <StyledTypography variant="h6" display="inline">
        {props.core.loadedState && props.core.loadedState.userLogin}
      </StyledTypography>
    </Toolbar>
  </AppBar>
));
