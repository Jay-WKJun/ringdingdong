import { getUserInfo, setUserInfo } from "@/services/db";
import {
  createNewSlackThread,
  getSlackThreadMessages,
  sendSlackMessage,
} from "@/services/slack";

import { createToken, verifyToken } from "./tokenController";

export function checkAndDecodeTokenController(token: string) {
  const jwtToken = token.replace(/^"(.*)"$/, "").replace(/^Bearer[\s]*/, "");
  return verifyToken(jwtToken);
}

export async function isUserExist({
  id,
  password,
}: {
  id: string;
  password: string;
}) {
  const recordedUserInfo = await getUserInfo(id);
  return recordedUserInfo?.password === password;
}

export function createTokenController({
  id,
  password,
}: {
  id: string;
  password: string;
}) {
  return createToken(id, password);
}

export async function createNewSlackThreadController({
  id,
  password,
  description,
}: {
  id: string;
  password: string;
  description: string;
}) {
  const newThread = await createNewSlackThread({ id, description });
  const threadId = newThread.ts as string;
  await setUserInfo(id, { id, password, threadId });
}

export async function slackMessageSendController(id: string, text: string) {
  const userInfo = await getUserInfo(id);
  if (!userInfo) {
    throw new Error("User not found");
  }

  return sendSlackMessage({ text, threadId: userInfo?.threadId });
}

export async function getSlackThreadHistories(id: string) {
  const userInfo = await getUserInfo(id);
  if (!userInfo) {
    return null;
  }

  return getSlackThreadMessages(userInfo.threadId);
}
