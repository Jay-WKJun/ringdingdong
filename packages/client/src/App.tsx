import { css } from "@emotion/react";
import React from "react";

import "./index.css";

const buttonStyle = css`
  position: fixed;
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

const imgStyle = css`
  width: 100%;
  height: 100%;
`;

function App() {
  return (
    <button type="button" css={buttonStyle} onClick={() => console.log("click")}>
      <img css={imgStyle} src="intercom-icon.png" alt="Intercom" />
    </button>
  );
}

export default App;
