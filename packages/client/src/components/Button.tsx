import { Interpolation, css, Theme } from "@emotion/react";
import { ButtonHTMLAttributes } from "react";

const buttonStyle = css`
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: inherit;
  cursor: pointer;
  transition: border-color 0.25s;

  &:hover {
    border-color: #646cff;
  }

  &:focus {
    outline: 4px auto -webkit-focus-ring-color;
  }
`;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  css?: Interpolation<Theme>;
  children?: React.ReactNode;
}

export function Button({ children, ...props }: ButtonProps) {
  return (
    // eslint-disable-next-line react/button-has-type
    <button {...props} css={[buttonStyle, props.css]}>
      {children}
    </button>
  );
}
