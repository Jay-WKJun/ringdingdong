import { css } from "@emotion/react";
import React from "react";

import { Spinner } from "@/components";

export function SendLoader() {
  return (
    <div
      css={css`
        display: flex;
        justify-content: center;
        align-items: center !important;
        width: 30px;
        height: 100%;
      `}
    >
      <Spinner
        css={css`
          width: 15px;
          height: 15px;
          border-width: 5px;
        `}
      />
    </div>
  );
}
