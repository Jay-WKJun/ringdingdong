import React from "react";

import { CommunicationPlatform } from "./containers";
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

  return <div>main</div>;
}
