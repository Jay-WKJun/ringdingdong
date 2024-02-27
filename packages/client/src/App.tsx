import { css } from "@emotion/react";
import React from "react";

import {
  AppGlobalContextProvider,
  AppGlobalContextProviderProps,
  PathContextProvider,
} from "./contexts";
import { Router } from "./Router";

const globalStyle = css`
  width: 100%;
  height: 100%;
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  a {
    position: relative;
  }

  input {
    border: none;
    outline: none;
  }

  button {
    border: none;
    cursor: pointer;
    background-color: #f9f9f9;
  }
`;

interface AppProps extends Omit<AppGlobalContextProviderProps, "children"> {}

function App(props: AppProps) {
  return (
    <AppGlobalContextProvider {...props}>
      <PathContextProvider>
        <div css={globalStyle}>
          <Router />
        </div>
      </PathContextProvider>
    </AppGlobalContextProvider>
  );
}

export default App;
