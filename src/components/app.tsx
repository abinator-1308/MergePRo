import React from "react";
import { observer } from "mobx-react-lite";
import { Paper } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { Popup } from "./Popup";
import { CoreProps } from "../interface";

export const App = observer((props: CoreProps) => {
  const palletType = "light";
  const darkTheme = createMuiTheme({
    palette: {
      type: palletType,
    },
    overrides: {},
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Paper>
        <Popup core={props.core} />
      </Paper>
    </ThemeProvider>
  );
});
