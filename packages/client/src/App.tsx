import { css } from "@emotion/react";
import React from "react";

import "./index.css";
import { CommunicationPlatform } from "./CommunicationPlatform";

const buttonStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background-color: #00b4ff;
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow:
    0 3px 6px rgba(0, 0, 0, 0.16),
    0 3px 6px rgba(0, 0, 0, 0.23);
`;

function App() {
  return (
    <div>
      <button type="button" css={buttonStyle} onClick={() => console.log("click")}>
        😁
      </button>
      <CommunicationPlatform />
    </div>
  );
}

export default App;
