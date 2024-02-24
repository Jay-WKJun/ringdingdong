import { JsonDB, Config } from "node-json-db";

import { ROOT_PATH } from "@/utils/env";

const db = new JsonDB(new Config(`${ROOT_PATH}/db/db.json`, true, true));

export type UserInfo = {
  id: string;
  password: string;
  threadId: string;
};

export async function getUserInfo(id: string) {
  const userInfo = (await db.getData(`/users/${id}`)) as string;
  if (!userInfo) {
    return null;
  }

  const userInfoObj = JSON.parse(userInfo);
  if (typeof userInfoObj !== "object") {
    return null;
  }

  return userInfoObj as UserInfo;
}

export async function setUserInfo(id: string, userInfo: UserInfo) {
  return db.push(`/users/${id}`, JSON.stringify(userInfo));
}
