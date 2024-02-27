import { createContext, useContext, useMemo } from "react";

import { apis } from "@/apis";
import { LocalStorageService } from "@/models/LocalStorageService";
import type { AppGlobal } from "@/types";

const AppGlobalContext = createContext<AppGlobal>({
  apis,
  serverUrl: "",
  localStorageService: null,
});

export interface AppGlobalContextProviderProps
  extends Omit<AppGlobal, "apis" | "localStorageService"> {
  tokenKey?: string;
  children: React.ReactNode;
}

export function AppGlobalContextProvider({
  children,
  serverUrl,
  tokenKey,
}: AppGlobalContextProviderProps) {
  const appGlobalValue = useMemo(() => {
    const appGlobal = {
      localStorageService: new LocalStorageService(tokenKey),
    };

    if (!serverUrl) return { ...appGlobal, serverUrl, apis };

    apis.serverUrl = serverUrl;
    return {
      ...appGlobal,
      serverUrl,
      apis: { ...apis },
    };
  }, [serverUrl, tokenKey]);

  return (
    <AppGlobalContext.Provider value={appGlobalValue}>
      {children}
    </AppGlobalContext.Provider>
  );
}

export function useAppGlobal() {
  return useContext(AppGlobalContext);
}
