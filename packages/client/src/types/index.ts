import type { apis } from "@/apis";

export interface AppGlobal {
  apis: typeof apis;
  serverUrl: string;
}

export interface Message {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  avatarUrl?: string;
  userId?: string;
}

export interface NewMessage extends Message {
  tempId: string;
}

export type MessageSendState = "sending" | "failed";

export interface MessageState {
  tempId?: string;
  sendState?: MessageSendState;
  message: Message;
}
