import { Global } from "@emotion/react";
import React from "react";

import { CommunicationPlatform } from "./CommunicationPlatform";
import { AppConfigContextProvider } from "./contexts/AppConfig";
import { MessageStatesContextProvider } from "./contexts/MessageStates";
import { globalStyle } from "./globalStyle";

interface AppProps {
  serverUrl: string;
}

function App({ serverUrl }: AppProps) {
  return (
    <AppConfigContextProvider serverUrl={serverUrl}>
      <MessageStatesContextProvider>
        <Global styles={globalStyle} />
        <CommunicationPlatform />
      </MessageStatesContextProvider>
    </AppConfigContextProvider>
  );
}

export default App;
