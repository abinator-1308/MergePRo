import { css, Global } from "@emotion/core";
import React from "react";
import ReactDOM from "react-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBan } from "@fortawesome/free-solid-svg-icons/faBan";
import { faBell } from "@fortawesome/free-solid-svg-icons/faBell";
import { faBellSlash } from "@fortawesome/free-solid-svg-icons/faBellSlash";
import { faClock } from "@fortawesome/free-solid-svg-icons/faClock";
import { faClone } from "@fortawesome/free-solid-svg-icons/faClone";
import { faPen } from "@fortawesome/free-solid-svg-icons/faPen";
import { faPodcast } from "@fortawesome/free-solid-svg-icons/faPodcast";
import { faReply } from "@fortawesome/free-solid-svg-icons/faReply";
import "bootstrap/dist/css/bootstrap.min.css";
import { chromeApiSingleton } from "./chrome/implementation";
import { App } from "./components/App";
import { Core } from "./state/core";
import { buildEnvironment } from "./environment/implementation";

library.add(faBan);
library.add(faBell);
library.add(faBellSlash);
library.add(faClock);
library.add(faPodcast);
library.add(faReply);
library.add(faPen);
library.add(faClone);

const env = buildEnvironment(chromeApiSingleton);
const core = new Core(env);
core.load().catch(console.error);

ReactDOM.render(
  <>
    <Global
      styles={css`
        body {
          color: #24292e;
          background-color: #fafbfc !important;
          margin: 0 auto;
          padding: 8px;
          width: 520px;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica,
            Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
          font-size: 14px;
        }

        a {
          color: #000;
        }

        .nav-tabs {
          background-color: #f1f8ff;
          border-bottom: none;
        }
      `}
    />
    <App core={core} />
  </>,
  document.getElementById("root")
);
