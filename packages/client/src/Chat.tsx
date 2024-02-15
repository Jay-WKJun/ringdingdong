import { css } from "@emotion/react";
import React, { useState } from "react";

import { Spinner } from "./components/Spinner";
import { useSetMessageStates } from "./contexts/MessageStates";
import type { Message, MessageSendState } from "./types";
import { SERVER_URL } from "./utils/env";
import { Parser } from "./utils/parser";

interface ChatProps {
  tempId?: number;
  sendState?: MessageSendState;
  message: Message;
}

export function Chat({ tempId, sendState, message }: ChatProps) {
  const [isHover, setIsHover] = useState(false);

  const setMessageStates = useSetMessageStates();

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
        {/* TODO: 리팩토링 및 디자인 적용 */}
        {sendState === "sending" && (
          <Spinner
            css={css`
              width: 100%;
              height: 100%;
              max-width: 100px;
              max-height: 100px;
              min-width: 30px;
              min-height: 30px;
            `}
          />
        )}
        {sendState === "failed" && (
          <div>
            <button
              type="button"
              onClick={() => {
                fetch(`${SERVER_URL}/1/message`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ tempId, text: message.message }),
                });
              }}
            >
              re
            </button>
            <button
              type="button"
              onClick={() => {
                setMessageStates((prev) => {
                  if (!prev) return prev;
                  return prev.filter((state) => state.tempId !== tempId);
                });
              }}
            >
              delete
            </button>
          </div>
        )}
        {isHover && !sendState && (
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
