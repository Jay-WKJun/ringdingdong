export interface AppConfig {
  serverUrl: string;
}

export interface Message {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  avatarUrl?: string;
  isMyMessage: boolean;
}

export type MessageSendState = "sending" | "failed";

export interface MessageState {
  tempId?: number;
  sendState?: MessageSendState;
  message: Message;
}
