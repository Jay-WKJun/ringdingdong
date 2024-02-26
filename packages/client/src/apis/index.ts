import { SERVER_URL } from "@/utils/env";

import { getHealthCheck } from "./apis";
import { postMessage, getMessages } from "./messageApis";
import { sseListener } from "./messageSubscribe";
import { getAuthToken, getRefreshToken, postUser } from "./userApis";

export type * from "./apis";
export type * from "./messageApis";
export type * from "./messageSubscribe";
export type * from "./userApis";

export const apis = {
  serverUrl: SERVER_URL,
  getHealthCheck,
  postMessage,
  getMessages,
  getAuthToken,
  getRefreshToken,
  postUser,
  sseListener,
};
