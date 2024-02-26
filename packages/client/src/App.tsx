import React from "react";

import { CommunicationPlatform } from "./containers";
import {
  AppGlobalContextProvider,
  MessageStatesContextProvider,
} from "./contexts";

interface AppProps {
  serverUrl: string;
}

function App({ serverUrl }: AppProps) {
  return (
    <AppGlobalContextProvider serverUrl={serverUrl}>
      <MessageStatesContextProvider>
        <CommunicationPlatform />
      </MessageStatesContextProvider>
    </AppGlobalContextProvider>
  );
}

export default App;
