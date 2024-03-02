import { Interpolation, css, Theme, useTheme } from "@emotion/react";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  css?: Interpolation<Theme>;
  children?: React.ReactNode;
}

export function Button({ children, ...props }: ButtonProps) {
  const theme = useTheme() as {
    backgroundColor: string;
    backgroundColor2: string;
    textColor: string;
    hoverColor: string;
  };

  return (
    // eslint-disable-next-line react/button-has-type
    <button
      {...props}
      css={[
        css`
          border: none;
          border-radius: 8px;
          padding: 0.6em 1.2em;
          font-size: 1em;
          font-weight: 500;
          font-family: inherit;
          background-color: ${theme.backgroundColor2};
          color: ${theme.textColor};
          cursor: pointer;

          &:hover {
            background-color: ${theme.hoverColor};
          }

          &:focus {
            outline: 4px auto -webkit-focus-ring-color;
          }
        `,
        props.css,
      ]}
    >
      {children}
    </button>
  );
}
