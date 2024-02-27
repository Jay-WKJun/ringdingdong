import React from "react";

import {
  AppGlobalContextProvider,
  AppGlobalContextProviderProps,
  PathContextProvider,
} from "./contexts";
import { Router } from "./Router";

interface AppProps extends Omit<AppGlobalContextProviderProps, "children"> {}

function App(props: AppProps) {
  return (
    <AppGlobalContextProvider {...props}>
      <PathContextProvider>
        <Router />
      </PathContextProvider>
    </AppGlobalContextProvider>
  );
}

export default App;
