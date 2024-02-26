import { createContext, useContext, useMemo } from "react";

import { apis } from "@/apis";
import type { AppConfig } from "@/types";

const AppConfigContext = createContext<AppConfig>({
  serverUrl: "http://localhost:3000",
});

interface AppConfigContextProviderProps extends AppConfig {
  children: React.ReactNode;
}

export function AppConfigContextProvider({
  children,
  serverUrl,
}: AppConfigContextProviderProps) {
  return (
    <AppConfigContext.Provider
      value={useMemo(() => {
        if (!serverUrl) return apis;

        return {
          ...apis,
          serverUrl,
        };
      }, [serverUrl])}
    >
      {children}
    </AppConfigContext.Provider>
  );
}

export function useAppConfig() {
  return useContext(AppConfigContext);
}
