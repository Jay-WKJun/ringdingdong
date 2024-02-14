export interface Message {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  avatarUrl?: string;
  isMyMessage: boolean;
}

export interface MessageState {
  isTemp?: boolean;
  message: Message;
}
