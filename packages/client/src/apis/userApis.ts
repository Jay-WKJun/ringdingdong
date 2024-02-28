export async function getAuthToken(this: { serverUrl: string }, token: string) {
  try {
    return fetch(`${this.serverUrl}/token/auth`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });
  } catch (e) {
    // @ts-expect-error: api error
    throw new Error(e);
  }
}

export interface PostRefreshTokenProps {
  id: string;
  password: string;
}

export async function getRefreshToken(
  this: { serverUrl: string },
  { id, password }: PostRefreshTokenProps,
) {
  try {
    return fetch(`${this.serverUrl}/token/refresh`, {
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

export interface PostUserProps {
  id: string;
  password: string;
  description: string;
}

export async function postUser(
  this: { serverUrl: string },
  { id, password, description }: PostUserProps,
) {
  try {
    return fetch(`${this.serverUrl}/user`, {
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
