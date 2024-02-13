import { css } from "@emotion/react";
import React from "react";

import { Chat, Tell } from "./Chat";

const messageListStyle = css`
  display: flex;
  flex-direction: column-reverse;
  gap: 10px;
  padding: 10px;
  height: calc(100% - 120px);
  overflow-y: auto;
`;

const mockTell: Tell[] = Array.from({ length: 10 }, (_, i) => ({
  id: `id${i}`,
  type: `type${i}`,
  message: `<b>bold${i + 1}</b> <i>italic${i + 1}</i> <s>strike${
    i + 1
  }</s> aoisdnfa;okjsndf;oqjnwefjoknqwefkmqawefjonveivnbaeiljvnsldijncv`,
  createdAt: new Date().toISOString(),
  isMyMessage: i % 2 === 0,
}));

export function ChatHistory() {
  // TODO: Virtual Scroll
  return (
    <div css={messageListStyle}>
      {mockTell.map((tell) => (
        <Chat key={tell.id} tell={tell} />
      ))}
    </div>
  );
}
