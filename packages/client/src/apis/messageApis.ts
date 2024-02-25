if (!fetch) {
  throw new Error("Need fetch API to run this code");
}

interface SendMessageParams {
  serverUrl: string;
  tempId: string;
  message: string;
}

export async function sendMessage({
  serverUrl,
  tempId,
  message,
}: SendMessageParams) {
  try {
    return fetch(`${serverUrl}/1/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tempId, text: message }),
    }).then((res) => res.json());
  } catch (e) {
    // @ts-expect-error: error handling
    throw new Error(e);
  }
}

interface GetMessagesParams {
  serverUrl: string;
}

export async function getMessages({ serverUrl }: GetMessagesParams) {
  try {
    return fetch(`${serverUrl}/1/messages`).then((res) => res.json());
  } catch (e) {
    // @ts-expect-error: error handling
    throw new Error(e);
  }
}
