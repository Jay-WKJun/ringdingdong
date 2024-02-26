import { css } from "@emotion/react";
import React, { useEffect } from "react";

import { Spinner } from "@/components";
import {
  useAppGlobal,
  useMessageStates,
  useSetMessageStates,
} from "@/contexts";
import type { Message } from "@/types";

import { Chat } from "./Chat";

export function ChatHistory() {
  const messageStates = useMessageStates();
  const setMessageStates = useSetMessageStates();
  const { apis } = useAppGlobal();

  useEffect(() => {
    setTimeout(() => {
      apis
        .getMessages()
        .then((res) =>
          setMessageStates(res?.map((message: Message) => ({ message }) || [])),
        );
    }, 1000);
  }, [apis, setMessageStates]);

  // TODO: Virtual Scroll
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column-reverse;
        gap: 10px;
        padding: 10px;
        width: 100%;
        height: calc(100% - 120px);
        overflow-y: auto;
        box-sizing: border-box;
      `}
    >
      {messageStates ? (
        messageStates.map(({ message, tempId, sendState }) => (
          <Chat
            key={message.id ?? tempId}
            message={message}
            tempId={tempId}
            sendState={sendState}
          />
        ))
      ) : (
        <div
          css={css`
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
          `}
        >
          <Spinner
            css={css`
              width: 100%;
              height: 100%;
              max-width: 50px;
              max-height: 50px;
              min-width: 30px;
              min-height: 30px;
            `}
          />
        </div>
      )}
    </div>
  );
}
