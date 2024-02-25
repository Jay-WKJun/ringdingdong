import { css } from "@emotion/react";
import React from "react";

import { Parser } from "@/utils/parser";

interface ChatContentProps {
  message: string;
}

export function ChatContent({ message }: ChatContentProps) {
  return (
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
      {Parser.parse(message)}
    </div>
  );
}
