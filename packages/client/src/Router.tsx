import { css } from "@emotion/react";
import React from "react";

import { Spinner } from "./components";
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

  return (
    <div
      css={css`
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      <Spinner />
    </div>
  );
}
