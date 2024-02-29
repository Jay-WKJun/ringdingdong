import { css, useTheme } from "@emotion/react";
import React, { useCallback } from "react";

import { TextEditor, Header } from "@/components";
import { useAppGlobal, useSetMessageStates } from "@/contexts";
import type { TalkToMeTheme } from "@/styles";

import { ChatHistory } from "./ChatHistory";

export function CommunicationPlatform() {
  const setMessageState = useSetMessageStates();
  const { apis, localStorageService } = useAppGlobal();

  const theme = useTheme() as TalkToMeTheme;

  const handleInputTextSubmit = useCallback(
    (text: string) => {
      const tempId = String(Math.floor(Math.random() * 100000000));
      setMessageState((prev) => {
        const newMessage = {
          message: {
            id: "11",
            message: text,
            type: "message",
            createdAt: new Date().toISOString(),
            userId: "1",
          },
          tempId,
        };

        if (!prev) return [newMessage];
        return [
          ...prev,
          {
            ...newMessage,
            sendState: "sending",
          },
        ];
      });

      const token = localStorageService?.getLocalStorage();
      if (!token) return;

      apis
        .postMessage({ message: text, tempId, token })
        .then((res) =>
          setMessageState(
            (prev) =>
              prev?.map((messageState) => {
                const { tempId, message } = messageState;

                if (res.tempId === tempId) {
                  return {
                    message,
                  };
                }
                return messageState;
              }),
          ),
        )
        .catch(() => {
          setMessageState(
            (prev) =>
              prev?.map((messageState) => {
                if (messageState.tempId === tempId) {
                  return {
                    ...messageState,
                    sendState: "failed",
                  };
                }
                return messageState;
              }),
          );
        });
    },
    [setMessageState, localStorageService, apis],
  );

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        height: 100%;
        min-width: 280px;
        min-height: 200px;
        border: 1px solid ${theme.borderColor};
        border-radius: 10px;
        background-color: ${theme.backgroundColor};
        box-sizing: border-box;
      `}
    >
      <Header />
      <ChatHistory />
      <TextEditor bottomMode onSubmit={handleInputTextSubmit} />
    </div>
  );
}
