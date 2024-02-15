import { createContext, useContext, useMemo } from "react";

import type { AppConfig } from "../types";

const AppConfigContext = createContext<AppConfig>({ serverUrl: "http://localhost:3000" });

interface AppConfigContextProviderProps extends AppConfig {
  children: React.ReactNode;
}

export function AppConfigContextProvider({ children, ...rest }: AppConfigContextProviderProps) {
  return <AppConfigContext.Provider value={useMemo(() => ({ ...rest }), [rest])}>{children}</AppConfigContext.Provider>;
}

export function useAppConfig() {
  return useContext(AppConfigContext);
}
