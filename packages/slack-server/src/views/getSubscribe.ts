import { RequestHandler } from "express";

import {
  checkAndDecodeTokenController,
  isUserExist,
} from "@/controllers/slackController";
import {
  addMessageListener,
  removeMessageListener,
} from "@/controllers/slackListener";
import { getUserInfo } from "@/services/db";
import { CLIENT_URL } from "@/utils/env";

export const getSubscribe: RequestHandler = async (req, res) => {
  const jwtToken = req.header("Authorization");
  if (!jwtToken) {
    res.status(400).send("Bad Request");
    return;
  }

  let decodedToken;
  try {
    decodedToken = checkAndDecodeTokenController(jwtToken);
    if (!(await isUserExist(decodedToken))) {
      res.status(401).send("Unauthorized");
      return;
    }
  } catch {
    res.status(401).send("Token expired or invalid");
    return;
  }
  const userInfo = (await getUserInfo(decodedToken.id))!;
  const threadId = userInfo.threadId;

  res.setHeader("Access-Control-Allow-Origin", CLIENT_URL);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  addMessageListener(
    threadId,
    ({ id, htmlText, avatarUrl, createdAt, type }) => {
      res.write(`id: ${id}\n`);
      res.write(
        `data: ${JSON.stringify({
          id,
          message: htmlText,
          createdAt,
          type,
          avatarUrl,
        })}\n\n`,
      );
    },
  );

  // If client closes connection, stop sending events
  res.on("close", () => {
    console.log("client dropped me");
    removeMessageListener(1708600002.841869);
    res.end();
  });
};
