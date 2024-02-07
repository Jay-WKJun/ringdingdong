import { css } from "@emotion/react";
import React from "react";

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

const headerStyle = css`
  height: 60px;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const messageListStyle = css`
  padding: 10px;
  height: calc(100% - 120px);
  overflow-y: auto;
`;

function Chat() {
  return (
    <div css={chatContainerStyle}>
      <div css={headerStyle}>
        <h4>Chat</h4>
        <button type="button">X</button>
      </div>
      <div css={messageListStyle}>
        <p>Message 1</p>
        <p>Message 2</p>
        <p>Message 3</p>
      </div>
      <TextEditor />
    </div>
  );
}

export default Chat;
