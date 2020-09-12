import React from "react";
import { Paper } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

export const App = () => {
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
        <></>
      </Paper>
    </ThemeProvider>
  );
};

