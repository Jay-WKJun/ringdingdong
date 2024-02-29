import { css, useTheme } from "@emotion/react";
import React, { useCallback, useState } from "react";

import {
  useAppGlobal,
  useSetPathContext,
  useSetMessageStates,
} from "@/contexts";
import type { TalkToMeTheme } from "@/styles";
import type { Message, MessageSendState } from "@/types";

import { Avatar } from "./Avatar";
import { ChatContent } from "./ChatContent";
import { ChatController } from "./ChatController";
import { SendFailController } from "./SendFailController";
import { SendLoader } from "./SendLoader";

interface ChatProps {
  tempId?: string;
  sendState?: MessageSendState;
  message: Message;
}

export function Chat({ tempId, sendState, message }: ChatProps) {
  const [isHover, setIsHover] = useState(false);

  const setMessageStates = useSetMessageStates();
  const { apis, localStorageService } = useAppGlobal();
  const setPath = useSetPathContext();

  const theme = useTheme() as TalkToMeTheme;

  const handleResendButtonClick = useCallback(async () => {
    if (!tempId || sendState !== "failed") return;

    setMessageStates((prev) => {
      if (!prev) return prev;
      return prev.map((state) => {
        if (state.tempId === tempId) {
          return { ...state, sendState: "sending" };
        }
        return state;
      });
    });

    try {
      const token = localStorageService?.getLocalStorage();
      if (!token) {
        alert("token is not found");
        setPath?.("main");
        return;
      }

      const res = await apis.postMessage({
        tempId,
        message: message.message,
        token,
      });

      setMessageStates((prev) => {
        if (!prev) return prev;
        return prev.map((state) => {
          if (state.tempId === res.tempId) {
            return { message };
          }
          return state;
        });
      });
    } catch {
      setMessageStates((prev) => {
        if (!prev) return prev;
        return prev.map((state) => {
          if (state.tempId === tempId) {
            return { ...state, sendState: "failed" };
          }
          return state;
        });
      });
    }
  }, [
    apis,
    localStorageService,
    message,
    sendState,
    setMessageStates,
    setPath,
    tempId,
  ]);

  const handleDeleteButtonClick = useCallback(() => {
    setMessageStates((prev) => {
      if (!prev) return prev;
      return prev.filter((state) => state.tempId !== tempId);
    });
  }, [setMessageStates, tempId]);

  const handleCopyButtonClick = useCallback(() => {
    navigator.clipboard.writeText(message.message);
  }, [message.message]);

  return (
    <div
      css={css`
        display: flex;
        flex-direction: ${message.userId == null ? "row" : "row-reverse"};
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
          background-color: ${theme.avatarBackgroundColor};
        `}
      >
        <Avatar message={message} />
      </div>
      <div
        css={css`
          display: flex;
          flex-direction: ${message.userId == null ? "row" : "row-reverse"};
          align-items: flex-end;
          flex: 1;
          gap: 5px;
        `}
      >
        <ChatContent message={message.message} />
        {sendState === "sending" && <SendLoader />}
        {sendState === "failed" && (
          <SendFailController
            onDeleteButtonClick={handleDeleteButtonClick}
            onResendButtonClick={handleResendButtonClick}
          />
        )}
        {isHover && !sendState && (
          <ChatController onCopyButtonClick={handleCopyButtonClick} />
        )}
      </div>
    </div>
  );
}
