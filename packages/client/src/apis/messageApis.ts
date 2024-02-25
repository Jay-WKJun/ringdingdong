if (!fetch) {
  throw new Error("Need fetch API to run this code");
}

interface PostMessageParams {
  serverUrl: string;
  tempId: string;
  message: string;
}

export async function postMessage({
  serverUrl,
  tempId,
  message,
}: PostMessageParams) {
  try {
    return fetch(`${serverUrl}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tempId, message }),
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
    return fetch(`${serverUrl}/messages`).then((res) => res.json());
  } catch (e) {
    // @ts-expect-error: error handling
    throw new Error(e);
  }
}
