import {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
  useContext,
  useEffect,
} from "react";

import { useAppGlobal } from ".";

type Path = "main" | "chat";

const PathContext = createContext<Path>("main");

const SetPathContext = createContext<Dispatch<SetStateAction<Path>> | null>(
  null,
);

interface PathContextProviderProps {
  children: React.ReactNode;
}

export function PathContextProvider({ children }: PathContextProviderProps) {
  const [path, setPath] = useState<Path>("main");

  const { localStorageService, apis } = useAppGlobal();

  useEffect(() => {
    if (!localStorageService) return;

    const token = localStorageService.getLocalStorage();
    if (token) {
      apis
        .getAuthToken(token)
        .then(() => {
          setPath("chat");
        })
        .catch(() => {
          setPath("main");
        });
    }
  }, [apis, localStorageService]);

  return (
    <PathContext.Provider value={path}>
      <SetPathContext.Provider value={setPath}>
        {children}
      </SetPathContext.Provider>
    </PathContext.Provider>
  );
}

export function usePathContext() {
  return useContext(PathContext);
}

export function useSetPathContext() {
  return useContext(SetPathContext);
}
