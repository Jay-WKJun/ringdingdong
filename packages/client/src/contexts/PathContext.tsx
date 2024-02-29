import {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
  useContext,
  useEffect,
} from "react";

import { useAppGlobal } from ".";

type Path = "main" | "chat" | null;

const PathContext = createContext<Path>(null);

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
        .then((e) => {
          if (e.status < 400) {
            console.log("token auth done");
            setPath("chat");
          } else {
            console.log("token auth failed");
            setPath("main");
          }
        })
        .catch(() => {
          console.log("token auth failed");
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
