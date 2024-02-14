import { css } from "@emotion/react";
import React, { useEffect } from "react";

import { Chat } from "./Chat";
import { useMessageStates, useSetMessageStates } from "./contexts/MessageStates";
import type { Message } from "./types";
import { SERVER_URL } from "./utils/env";

const messageListStyle = css`
  display: flex;
  flex-direction: column-reverse;
  gap: 10px;
  padding: 10px;
  width: 100%;
  height: calc(100% - 120px);
  overflow-y: auto;
  box-sizing: border-box;
`;

export function ChatHistory() {
  const messageStates = useMessageStates();
  const setMessageStates = useSetMessageStates();

  useEffect(() => {
    setTimeout(() => {
      fetch(`${SERVER_URL}/1/messages`)
        .then((res) => res.json())
        .then((res) => setMessageStates(res?.map((message: Message) => ({ message }) || [])));
    }, 1000);
  }, [setMessageStates]);

  // TODO: Virtual Scroll
  return (
    <div css={messageListStyle}>
      {messageStates ? (
        messageStates.map(({ message }) => <Chat key={message.id} message={message} />)
      ) : (
        <div
          css={css`
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
          `}
        >
          Loading...
        </div>
      )}
    </div>
  );
}
