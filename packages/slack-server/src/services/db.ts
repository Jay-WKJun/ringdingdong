import { JsonDB, Config } from "node-json-db";

import { ROOT_PATH } from "@/utils/env";

const db = new JsonDB(new Config(`${ROOT_PATH}/db/db.json`, true, true));

const BOT_ID_PATH = "/botId";

const USER_PATH = "/users";

function getUserPath(id: string) {
  return `${USER_PATH}/${id}`;
}

export async function getBotId() {
  try {
    const botId = (await db.getData(BOT_ID_PATH)) as string;
    if (!botId) return null;
    return botId;
  } catch {
    return null;
  }
}

export async function setBotId(botId: string) {
  try {
    await db.push(BOT_ID_PATH, botId);
  } catch {
    throw new Error("Failed to set bot id");
  }
}

export type UserInfo = {
  id: string;
  password: string;
  threadId: string;
};

export async function getUserInfo(id: string) {
  let userInfo: string;
  try {
    userInfo = (await db.getData(getUserPath(id))) as string;
    if (!userInfo) {
      return null;
    }
  } catch {
    return null;
  }

  const userInfoObj = JSON.parse(userInfo);
  if (typeof userInfoObj !== "object") {
    return null;
  }

  return userInfoObj as UserInfo;
}

export async function setUserInfo(id: string, userInfo: UserInfo) {
  return db.push(getUserPath(id), JSON.stringify(userInfo));
}
