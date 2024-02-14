import { css } from "@emotion/react";
import React, { useState } from "react";

import type { Message } from "./types";
import { Parser } from "./utils/parser";

interface ChatProps {
  message: Message;
}

export function Chat({ message }: ChatProps) {
  const [isHover, setIsHover] = useState(false);
  return (
    <div
      css={css`
        display: flex;
        flex-direction: ${message.isMyMessage ? "row-reverse" : "row"};
        align-items: center;
        width: 100%;
        padding: 0 10px;
        box-sizing: border-box;
        gap: 10px;
      `}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
          width: 40px;
          min-width: 40px;
          height: 40px;
          border-radius: 100%;
          overflow: hidden;
          background-color: red;
        `}
      >
        {message.avatarUrl ? (
          <img
            css={css`
              width: inherit;
              height: inherit;
            `}
            src={message.avatarUrl}
            alt={`${message.id}-avatar`}
          />
        ) : (
          <div>{message.isMyMessage ? "😁" : "✋"}</div>
        )}
      </div>
      <div
        css={css`
          display: flex;
          flex-direction: ${message.isMyMessage ? "row-reverse" : "row"};
          align-items: flex-end;
          flex: 1;
          gap: 5px;
        `}
      >
        <div
          contentEditable={false}
          css={css`
            background-color: #c9c5c5;
            padding: 1em;
            border-radius: 20px;
            max-width: 65%;
            white-space: break-spaces;
            word-break: break-all;
          `}
        >
          {Parser.parse(message.message)}
        </div>
        {isHover && (
          <div
            css={css`
              padding-bottom: 5px;
            `}
          >
            <button
              type="button"
              css={css`
                display: flex;
                justify-content: center;
                align-items: center;
                width: 30px;
                height: 20px;
                font-size: 0.5em;
              `}
              onClick={() => {
                navigator.clipboard.writeText(message.message);
              }}
            >
              📎
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
