import { css } from "@emotion/react";
import React from "react";

import type { Message } from "@/types";

interface AvatarProps {
  message: Message;
}

export function Avatar({ message }: AvatarProps) {
  const { userId, avatarUrl, id } = message;
  if (!avatarUrl) {
    return <div>{userId == null ? "너" : "나"}</div>;
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
