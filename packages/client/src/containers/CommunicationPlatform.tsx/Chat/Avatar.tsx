import { css } from "@emotion/react";
import React from "react";

import type { Message } from "@/types";

interface AvatarProps {
  message: Message;
}

export function Avatar({ message }: AvatarProps) {
  const { isMyMessage, avatarUrl, id } = message;
  if (!avatarUrl) {
    return <div>{isMyMessage ? "😁" : "✋"}</div>;
  }

  return (
    <img
      css={css`
        width: inherit;
        height: inherit;
      `}
      src={avatarUrl}
      alt={`${id}-avatar`}
    />
  );
}
