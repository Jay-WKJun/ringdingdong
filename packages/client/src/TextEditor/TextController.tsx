import { css } from "@emotion/react";
import React from "react";

import { ANCHOR, BOLD, ITALIC, ORDERED_LIST, STRIKE, UNDERLINE, UNORDERED_LIST } from "./constants";

interface TextControllerProps {
  textStates: string[];
  indentState: string;
}

export function TextController({ textStates, indentState }: TextControllerProps) {
  return (
    <div
      css={css`
        display: flex;
        gap: 5px;
        border: none;
        background-color: #f9f9f9;
        padding: 5px 3px;
        border-radius: 5px;
        overflow: hidden;
        box-sizing: border-box;
        margin-bottom: 5px;

        button {
          flex: 1;
          padding: 0.3em;
          border: none;
          cursor: pointer;

          &:hover {
            background-color: #e0e0e0;
          }
        }
      `}
    >
      <button
        type="button"
        css={css`
          background-color: ${textStates.includes(BOLD) ? "lightgray" : "#f9f9f9"};
        `}
        onClick={() => {
          document.execCommand("bold");
        }}
      >
        𝐁
      </button>
      <button
        type="button"
        css={css`
          background-color: ${textStates.includes(ITALIC) ? "lightgray" : "#f9f9f9"};
        `}
        onClick={() => {
          document.execCommand("italic");
        }}
      >
        𝐼
      </button>
      <button
        type="button"
        css={css`
          background-color: ${textStates.includes(STRIKE) ? "lightgray" : "#f9f9f9"};
        `}
        onClick={() => {
          document.execCommand("strikethrough");
        }}
      >
        ℔
      </button>
      <button
        type="button"
        css={css`
          background-color: ${textStates.includes(UNDERLINE) ? "lightgray" : "#f9f9f9"};
        `}
        onClick={() => {
          document.execCommand("underline");
        }}
      >
        ⨱
      </button>
      <button
        type="button"
        css={css`
          background-color: ${textStates.includes(ANCHOR) ? "lightgray" : "#f9f9f9"};
        `}
        onClick={() => {
          const isLinked = textStates.includes(ANCHOR);
          if (isLinked) {
            document.execCommand("unlink");
            return;
          }

          const url = window.prompt("Enter URL:");
          document.execCommand("createLink", false, url || "https://www.google.com");
        }}
      >
        🔗
      </button>
      <button
        type="button"
        css={css`
          background-color: ${indentState === UNORDERED_LIST ? "lightgray" : "#f9f9f9"};
        `}
        onClick={() => {
          document.execCommand("insertUnorderedList");
        }}
      >
        ●
      </button>
      <button
        type="button"
        css={css`
          background-color: ${indentState === ORDERED_LIST ? "lightgray" : "#f9f9f9"};
        `}
        onClick={() => {
          document.execCommand("insertUnorderedList");
        }}
      >
        №
      </button>
    </div>
  );
}
