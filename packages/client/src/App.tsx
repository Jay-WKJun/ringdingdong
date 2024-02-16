import React from "react";

import { CommunicationPlatform } from "./CommunicationPlatform";
import { AppConfigContextProvider } from "./contexts/AppConfig";
import { MessageStatesContextProvider } from "./contexts/MessageStates";

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
