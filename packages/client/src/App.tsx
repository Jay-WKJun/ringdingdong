import React from "react";

import { CommunicationPlatform } from "./containers";
import {
  AppConfigContextProvider,
  MessageStatesContextProvider,
} from "./contexts";

interface AppProps {
  serverUrl: string;
}

function App({ serverUrl }: AppProps) {
  return (
    <AppConfigContextProvider serverUrl={serverUrl}>
      <MessageStatesContextProvider>
        <CommunicationPlatform />
      </MessageStatesContextProvider>
    </AppConfigContextProvider>
  );
}

export default App;
