import { css, useTheme } from "@emotion/react";
import React from "react";

import type { TalkToMeTheme } from "@/styles";
import { Parser } from "@/utils/parser";

interface ChatContentProps {
  message: string;
}

export function ChatContent({ message }: ChatContentProps) {
  const theme = useTheme() as TalkToMeTheme;

  return (
    <div
      contentEditable={false}
      css={css`
        background-color: ${theme.chatBackgroundColor};
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
