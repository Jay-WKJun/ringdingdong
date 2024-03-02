import { css, useTheme } from "@emotion/react";
import React from "react";

import { Button } from "@/components/Button";

import {
  ANCHOR,
  BOLD,
  ITALIC,
  ORDERED_LIST,
  STRIKE,
  UNORDERED_LIST,
} from "./constants";
import { TextControllerTheme } from "./styles";

interface TextControllerProps {
  textStates: string[];
  indentState: string;
}

export function TextController({
  textStates,
  indentState,
}: TextControllerProps) {
  const theme = useTheme() as TextControllerTheme;

  return (
    <div
      css={css`
        display: flex;
        gap: 5px;
        border: none;
        background-color: ${theme.backgroundColor2};
        padding: 5px 3px;
        border-radius: 5px;
        overflow: hidden;
        box-sizing: border-box;

        button {
          flex: 1;
          padding: 0.3em;
        }
      `}
    >
      <Button
        type="button"
        css={css`
          ${textStates.includes(BOLD) &&
          `background-color: ${theme.backgroundColor} !important;`}
        `}
        onClick={() => {
          document.execCommand("bold");
        }}
      >
        𝐁
      </Button>
      <Button
        type="button"
        css={css`
          ${textStates.includes(ITALIC) &&
          `background-color: ${theme.backgroundColor} !important;`}
        `}
        onClick={() => {
          document.execCommand("italic");
        }}
      >
        𝐼
      </Button>
      <Button
        type="button"
        css={css`
          ${textStates.includes(STRIKE) &&
          `background-color: ${theme.backgroundColor} !important;`};
        `}
        onClick={() => {
          document.execCommand("strikethrough");
        }}
      >
        ℔
      </Button>
      <Button
        type="button"
        css={css`
          ${textStates.includes(ANCHOR) &&
          `background-color: ${theme.backgroundColor} !important;`};
        `}
        onClick={() => {
          const isLinked = textStates.includes(ANCHOR);
          if (isLinked) {
            document.execCommand("unlink");
            return;
          }

          const url = window.prompt("Enter URL:");
          document.execCommand(
            "createLink",
            false,
            url || "https://www.google.com",
          );
        }}
      >
        🔗
      </Button>
      <Button
        type="button"
        css={css`
          ${indentState === UNORDERED_LIST &&
          `background-color: ${theme.backgroundColor} !important;`}
        `}
        onClick={() => {
          document.execCommand("insertUnorderedList");
        }}
      >
        ●
      </Button>
      <Button
        type="button"
        css={css`
          ${indentState === ORDERED_LIST &&
          `background-color: ${theme.backgroundColor} !important;`}
        `}
        onClick={() => {
          document.execCommand("insertOrderedList");
        }}
      >
        №
      </Button>
    </div>
  );
}
