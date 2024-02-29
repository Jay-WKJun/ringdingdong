import { ThemeProvider } from "@emotion/react";
import React, { useMemo, memo } from "react";

import {
  AppGlobalContextProvider,
  AppGlobalContextProviderProps,
  PathContextProvider,
} from "./contexts";
import { Global } from "./Global";
import { TalkToMeTheme, themes } from "./styles";

interface AppProps extends Omit<AppGlobalContextProviderProps, "children"> {
  themeMode?: string;
}

function App(props: AppProps) {
  const { themeMode } = props;

  const theme = useMemo(() => {
    const themeRes = themeMode && themes[themeMode];
    if (themeRes) return themeRes;

    const isDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const systemMode = isDark ? "dark" : "light";

    return themes[systemMode] as TalkToMeTheme;
  }, [themeMode]);

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
