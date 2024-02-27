import { css } from "@emotion/react";
import React from "react";

import { Spinner } from "@/components";

export function Scratch() {
  return (
    <main
      css={css`
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      <Spinner />
    </main>
  );
}
