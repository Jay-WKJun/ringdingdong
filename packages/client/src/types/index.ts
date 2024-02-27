import type { apis } from "@/apis";
import { LocalStorageService } from "@/models/LocalStorageService";

export interface AppGlobal {
  apis: typeof apis;
  serverUrl: string;
  localStorageService: LocalStorageService | null;
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
