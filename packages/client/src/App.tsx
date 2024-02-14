import React from "react";

import "./index.css";
import { CommunicationPlatform } from "./CommunicationPlatform";
import { MessageStatesContextProvider } from "./contexts/MessageStates";

function App() {
  return (
    <MessageStatesContextProvider>
      <CommunicationPlatform />
    </MessageStatesContextProvider>
  );
}

export default App;
