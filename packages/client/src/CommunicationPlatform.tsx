import { css } from "@emotion/react";
import React from "react";

import { ChatHistory } from "./ChatHistory";
import { Header } from "./Header";
import { TextEditor } from "./TextEditor";

const chatContainerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  height: 100%;
  min-height: 300px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
  box-sizing: border-box;
`;

export function CommunicationPlatform() {
  return (
    <div style={{ height: "100vh" }}>
      <div css={chatContainerStyle}>
        <Header />
        <ChatHistory />
        <TextEditor bottomMode />
      </div>
    </div>
  );
}
