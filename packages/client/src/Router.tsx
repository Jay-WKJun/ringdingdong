import React from "react";

import { CommunicationPlatform, Main } from "./containers";
import { usePathContext, MessageStatesContextProvider } from "./contexts";

export function Router() {
  const path = usePathContext();

  if (path === "chat") {
    return (
      <MessageStatesContextProvider>
        <CommunicationPlatform />
      </MessageStatesContextProvider>
    );
  }

  if (path === "main") {
    return <Main />;
  }

  return <div>scratch loading...</div>;
}
