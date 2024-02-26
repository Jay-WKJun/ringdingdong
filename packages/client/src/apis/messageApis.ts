import type { NewMessage, Message } from "@/types";

if (!fetch) {
  throw new Error("Need fetch API to run this code");
}

export interface PostMessageParams {
  tempId: string;
  message: string;
  token: string;
}

export interface PostMessageResponse extends NewMessage {}

export async function postMessage(
  this: { serverUrl: string },
  { tempId, message, token }: PostMessageParams,
): Promise<PostMessageResponse> {
  try {
    return fetch(`${this.serverUrl}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ tempId, message }),
    }).then((res) => res.json());
  } catch (e) {
    // @ts-expect-error: error handling
    throw new Error(e);
  }
}

export type GetMessagesResponse = Message[];

export async function getMessages(
  this: {
    serverUrl: string;
  },
  token: string,
): Promise<GetMessagesResponse> {
  try {
    return fetch(`${this.serverUrl}/messages`, {
      headers: {
        Authorization: token,
      },
    }).then((res) => res.json());
  } catch (e) {
    // @ts-expect-error: error handling
    throw new Error(e);
  }
}
