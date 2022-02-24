import React from "react";
import "./App.css";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";

import Main from "../pages/main";
import { DataProvider } from "../context/DataContext";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#333996",
      light: "#3c44b126",
    },
    secondary: {
      main: "#f83245",
      light: "#f8324526",
    },
    background: {
      default: "#f4f5fd",
    },
  },
  overrides: {
    MuiAppBar: {
      root: {
        transform: "translateZ(0)",
      },
    },
  },
  props: {
    MuiIconButton: {
      disableRipple: true,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <DataProvider>
        <Main />
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
