import { css } from "@emotion/react";
import React from "react";

const headerStyle = css`
  height: 60px;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

interface HeaderProps {}

export function Header({}: HeaderProps) {
  return (
    <div css={headerStyle}>
      <h4>Chat</h4>
      <button type="button">X</button>
    </div>
  );
}
