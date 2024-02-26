import { createContext, useContext, useMemo } from "react";

import { apis } from "@/apis";
import type { AppGlobal } from "@/types";

const AppGlobalContext = createContext<AppGlobal>({
  apis,
  serverUrl: "",
});

interface AppGlobalContextProviderProps extends Omit<AppGlobal, "apis"> {
  children: React.ReactNode;
}

export function AppGlobalContextProvider({
  children,
  serverUrl,
}: AppGlobalContextProviderProps) {
  return (
    <AppGlobalContext.Provider
      value={useMemo(() => {
        if (!serverUrl) return { serverUrl, apis };

        apis.serverUrl = serverUrl;
        return {
          serverUrl,
          apis: { ...apis },
        };
      }, [serverUrl])}
    >
      {children}
    </AppGlobalContext.Provider>
  );
}

export function useAppGlobal() {
  return useContext(AppGlobalContext);
}
