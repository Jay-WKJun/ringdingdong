import { ThemeProvider } from "@emotion/react";
import React, { memo } from "react";

import {
  AppGlobalContextProvider,
  AppGlobalContextProviderProps,
  PathContextProvider,
} from "./contexts";
import { Global } from "./Global";
import { useThemeSetter } from "./hooks";
import { themes } from "./styles";

interface AppProps extends Omit<AppGlobalContextProviderProps, "children"> {
  themeMode?: string;
}

function App(props: AppProps) {
  const { themeMode } = props;

  const theme = useThemeSetter(themes, themeMode);

  return (
    <ThemeProvider theme={theme}>
      <AppGlobalContextProvider {...props}>
        <PathContextProvider>
          <Global />
        </PathContextProvider>
      </AppGlobalContextProvider>
    </ThemeProvider>
  );
}

const TalkToMe = memo(App);
export default TalkToMe;
