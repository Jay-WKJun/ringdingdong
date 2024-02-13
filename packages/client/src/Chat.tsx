import { css } from "@emotion/react";
import React, { useState } from "react";

export interface Tell {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  avatarUrl?: string;
  isMyMessage: boolean;
}

interface ChatProps {
  tell: Tell;
}

export function Chat({ tell }: ChatProps) {
  const [isHover, setIsHover] = useState(false);
  // 양쪽 끝에 아바타
  // 마우스가 올라가면 끝으로 뭔가 나오도록 하기, 기능은 클립보드 복사 (별도의 컴포넌트)
  // HTML을 받아들일 수 있도록 contentEditable, fix 불가하도록
  return (
    <div
      css={css`
        display: flex;
        flex-direction: ${tell.isMyMessage ? "row-reverse" : "row"};
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
        {tell.avatarUrl ? (
          <img
            css={css`
              width: inherit;
              height: inherit;
            `}
            src={tell.avatarUrl}
            alt={`${tell.id}-avatar`}
          />
        ) : (
          <div>{tell.isMyMessage ? "😁" : "✋"}</div>
        )}
      </div>
      <div
        css={css`
          display: flex;
          flex-direction: ${tell.isMyMessage ? "row-reverse" : "row"};
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
          dangerouslySetInnerHTML={{ __html: tell.message }}
        />
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
                navigator.clipboard.writeText(tell.message);
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
