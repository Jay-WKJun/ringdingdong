import { css } from "@emotion/react";
import React, { useCallback } from "react";

import { postMessage } from "@/apis/messageApis";
import { TextEditor } from "@/components";
import { useAppConfig, useSetMessageStates } from "@/contexts";
import { Header } from "@/Header";

import { ChatHistory } from "./ChatHistory";

const globalStyle = css`
  width: 100%;
  height: 100%;
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
`;

const chatContainerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  height: 100%;
  min-width: 280px;
  min-height: 200px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
  box-sizing: border-box;
`;

export function CommunicationPlatform() {
  const setMessageState = useSetMessageStates();
  const appConfig = useAppConfig();

  const handleInputTextSubmit = useCallback(
    (text: string) => {
      const tempId = String(Math.floor(Math.random() * 100000000));
      setMessageState((prev) => {
        if (!prev)
          return [
            {
              message: {
                id: "11",
                message: text,
                type: "message",
                createdAt: new Date().toISOString(),
                userId: "1",
              },
              tempId,
            },
          ];
        return [
          {
            message: {
              id: "11",
              message: text,
              type: "message",
              createdAt: new Date().toISOString(),
              userId: "1",
            },
            tempId,
            sendState: "sending",
          },
          ...prev,
        ];
      });

      postMessage({ serverUrl: appConfig.serverUrl, message: text, tempId })
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
    [appConfig.serverUrl, setMessageState],
  );

  return (
    <div css={globalStyle}>
      <div css={chatContainerStyle}>
        <Header />
        <ChatHistory />
        <TextEditor bottomMode onSubmit={handleInputTextSubmit} />
      </div>
    </div>
  );
}
