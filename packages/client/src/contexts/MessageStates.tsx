import { useState, Dispatch, SetStateAction, createContext, useContext } from "react";

import type { MessageState } from "../types";

export type MessageStatesType = MessageState[] | undefined;

const MessageStatesContext = createContext<MessageStatesType>(undefined);
const MessageStatesDispatchContext = createContext<Dispatch<SetStateAction<MessageStatesType>>>(() => {});

interface MessageStateContextProviderProps {
  children: React.ReactNode;
}

export function MessageStatesContextProvider({ children }: MessageStateContextProviderProps) {
  const [messageStates, setMessageStates] = useState<MessageStatesType>();

  return (
    <MessageStatesContext.Provider value={messageStates}>
      <MessageStatesDispatchContext.Provider value={setMessageStates}>{children}</MessageStatesDispatchContext.Provider>
    </MessageStatesContext.Provider>
  );
}

export function useMessageStates() {
  return useContext(MessageStatesContext);
}

export function useSetMessageStates() {
  return useContext(MessageStatesDispatchContext);
}
