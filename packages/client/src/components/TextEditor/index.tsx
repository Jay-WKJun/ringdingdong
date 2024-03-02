import { ThemeProvider } from "@emotion/react";
import { memo } from "react";

import { useThemeSetter } from "@/hooks";

import { textControllerThemes } from "./styles";
import {
  TextEditor as OriginalTextEditor,
  TextEditorProps as OriginalProps,
} from "./TextEditor";

interface TextEditorProps extends OriginalProps {
  themeMode?: string;
}

function TextEditorStyle(props: TextEditorProps) {
  const { themeMode, ...rest } = props;

  const theme = useThemeSetter(textControllerThemes, "dark");

  return (
    <ThemeProvider theme={theme}>
      <OriginalTextEditor {...rest} />
    </ThemeProvider>
  );
}

export const TextEditor = memo(TextEditorStyle);
export default memo(TextEditor);
