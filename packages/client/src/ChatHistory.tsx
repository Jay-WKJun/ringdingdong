import { css } from "@emotion/react";
import React, { useEffect, useState } from "react";

import { Chat, Message } from "./Chat";

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

const mockMessages: Message[] = Array.from({ length: 10 }, (_, i) => ({
  id: `id${i}`,
  type: `type${i}`,
  message: `<b>bold${i + 1}</b> <i>italic${i + 1}</i> <s>strike${
    i + 1
  }</s> aoisdnfa;okjsndf;oqjnwefjoknqwefkmqawefjonveivnbaeiljvnsldijncv`,
  createdAt: new Date().toISOString(),
  isMyMessage: i % 2 === 0,
}));

interface MessageState {
  isTemp?: boolean;
  message: Message;
}

const mockChats = mockMessages.map((message) => ({ message }));

export function ChatHistory() {
  // TODO: state는 context로 관리
  const [chats, setChats] = useState<MessageState[]>();

  useEffect(() => {
    setTimeout(() => {
      setChats(mockChats || []);
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
