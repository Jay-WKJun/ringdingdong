export async function getAuthToken(serverUrl: string, token: string) {
  try {
    return fetch(`${serverUrl}/auth_token`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    }).then((res) => res.json());
  } catch (e) {
    // @ts-expect-error: api error
    throw new Error(e);
  }
}

interface PostRefreshTokenProps {
  serverUrl: string;
  id: string;
  password: string;
}

export async function getRefreshToken({
  serverUrl,
  id,
  password,
}: PostRefreshTokenProps) {
  try {
    return fetch(`${serverUrl}/refresh_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, password }),
    }).then((res) => res.json());
  } catch (e) {
    // @ts-expect-error: api error
    throw new Error(e);
  }
}

interface PostUserProps {
  serverUrl: string;
  id: string;
  password: string;
  description: string;
}

export async function postUser({
  serverUrl,
  id,
  password,
  description,
}: PostUserProps) {
  try {
    return fetch(`${serverUrl}/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, password, description }),
    })
      .then((res) => res.json())
      .then((res) => res.token as string);
  } catch (e) {
    // @ts-expect-error: api error
    throw new Error(e);
  }
}
