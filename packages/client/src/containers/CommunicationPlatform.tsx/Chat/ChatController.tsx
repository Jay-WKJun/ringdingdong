import { css } from "@emotion/react";
import React from "react";

import { Button } from "@/components";

interface ChatControllerProps {
  onCopyButtonClick?: () => void;
}

export function ChatController({ onCopyButtonClick }: ChatControllerProps) {
  return (
    <div
      css={css`
        padding-bottom: 5px;
      `}
    >
      <Button
        type="button"
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
          width: 30px;
          height: 20px;
          font-size: 0.5em;
        `}
        onClick={onCopyButtonClick}
      >
        📎
      </Button>
    </div>
  );
}
