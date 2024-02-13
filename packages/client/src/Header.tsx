import { css } from "@emotion/react";
import React from "react";

const headerStyle = css`
  height: 40px;
  padding: 10px;
  padding-left: 20px;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export function Header() {
  return (
    <div css={headerStyle}>
      <h4>Chat</h4>
      <button type="button">X</button>
    </div>
  );
}
