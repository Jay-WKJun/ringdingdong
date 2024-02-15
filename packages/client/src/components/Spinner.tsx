import { css, keyframes } from "@emotion/react";
import React, { HTMLAttributes } from "react";

const spin = keyframes`
  0%{
    transform : rotate(0deg);
  }
  100%{
    transform : rotate(360deg);
  }
`;

const spinnerStyle = css`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  aspect-ratio: 1 / 1;

  border: 10px solid #ccc;
  border-top-color: #007bff;
  animation: ${spin} 1s linear infinite;
`;

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {}

export function Spinner(props: SpinnerProps) {
  return <div css={spinnerStyle} {...props} />;
}
