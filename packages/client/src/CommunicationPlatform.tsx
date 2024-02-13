import { css } from "@emotion/react";
import React from "react";

import { ChatHistory } from "./ChatHistory";
import { Header } from "./Header";
import { TextEditor } from "./TextEditor";

const chatContainerStyle = css`
  bottom: 0;
  right: 0;
  width: 300px;
  height: 500px;
  padding: 10px 0;
  border: 1px solid #ccc;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export function CommunicationPlatform() {
  return (
    <div css={chatContainerStyle}>
      <Header />
      <ChatHistory />
      <TextEditor />
    </div>
  );
}
