import { css } from "@emotion/react";
import React, { useEffect, useState } from "react";

import { Chat, Message } from "./Chat";
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

interface MessageState {
  isTemp?: boolean;
  message: Message;
}

export function ChatHistory() {
  // TODO: state는 context로 관리
  const [chats, setChats] = useState<MessageState[]>();

  useEffect(() => {
    setTimeout(() => {
      fetch(`${SERVER_URL}/1/messages`)
        .then((res) => res.json())
        .then((res) => setChats(res?.map((message: Message) => ({ message }) || [])));
    }, 1000);
  }, []);

  // TODO: Virtual Scroll
  return (
    <div css={messageListStyle}>
      {chats ? (
        chats.map(({ message }) => <Chat key={message.id} message={message} />)
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
