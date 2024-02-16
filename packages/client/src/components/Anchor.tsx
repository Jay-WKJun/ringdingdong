import { Interpolation, css, Theme } from "@emotion/react";
import { HTMLAttributes } from "react";

const anchorStyle = css`
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
  cursor: pointer;

  &:hover {
    color: #535bf2;
  }
`;

interface AnchorProps extends HTMLAttributes<HTMLAnchorElement> {
  css?: Interpolation<Theme>;
  children?: React.ReactNode;
}

export function Anchor({ children, ...props }: AnchorProps) {
  return (
    <a {...props} css={[anchorStyle, props.css]}>
      {children}
    </a>
  );
}
