import { css } from "@emotion/react";
import React from "react";

import { ChatHistory } from "./ChatHistory";
import { useSetMessageStates } from "./contexts/MessageStates";
import { Header } from "./Header";
import { TextEditor } from "./TextEditor";
import { SERVER_URL } from "./utils/env";

const chatContainerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 300px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
  box-sizing: border-box;
`;

export function CommunicationPlatform() {
  const setMessageState = useSetMessageStates();

  return (
    <div style={{ height: "100vh" }}>
      <div css={chatContainerStyle}>
        <Header />
        <ChatHistory />
        <TextEditor
          bottomMode
          onSubmit={(text) => {
            // TODO: 리팩토링
            const tempId = Math.floor(Math.random() * 100000000);
            setMessageState((prev) => {
              if (!prev)
                return [
                  {
                    message: {
                      id: "11",
                      message: text,
                      type: "message",
                      createdAt: new Date().toISOString(),
                      isMyMessage: true,
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
                    isMyMessage: true,
                  },
                  tempId,
                  sendState: "sending",
                },
                ...prev,
              ];
            });

            fetch(`${SERVER_URL}/1/message`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ tempId, text }),
            })
              .then((res) => res.json())
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
          }}
        />
      </div>
    </div>
  );
}
