export interface Message {
  id?: string;
  type?: string;
  message?: string;
  createdAt?: string;
  avatarUrl?: string;
  userId?: string;
}

export interface NewMessage extends Message {
  tempId: string;
}
