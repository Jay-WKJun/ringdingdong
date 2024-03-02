import { useTheme, css } from "@emotion/react";
import React from "react";

import { Router } from "./Router";
import type { TalkToMeTheme } from "./styles";

export function Global() {
  const theme = useTheme() as TalkToMeTheme;

  return (
    <div
      css={css`
        width: 100%;
        height: 100%;
        font-family: inherit, Inter, system-ui, Avenir, Helvetica, Arial,
          sans-serif;
        line-height: 1.5;
        font-weight: 400;
        color: ${theme.textColor};

        a {
          position: relative;
        }

        input {
          border: none;
          outline: none;
        }
      `}
    >
      <Router />
    </div>
  );
}
