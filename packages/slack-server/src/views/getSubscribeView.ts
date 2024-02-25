import { RequestHandler } from "express";

import {
  checkAndDecodeTokenController,
  isUserExist,
} from "@/controllers/slackController";
import {
  addMessageListener,
  removeMessageListener,
} from "@/controllers/slackListener";
import { CLIENT_URL } from "@/utils/env";

export const getSubscribe: RequestHandler = async (req, res) => {
  const jwtToken = req.header("Authorization");
  if (!jwtToken) {
    res.status(400).send("Bad Request");
    return;
  }

  try {
    const decodedToken = checkAndDecodeTokenController(jwtToken);

    if (!(await isUserExist(decodedToken))) {
      res.status(401).send("Unauthorized");
    }
  } catch {
    res.status(401).send("Token expired or invalid");
  }

  res.setHeader("Access-Control-Allow-Origin", CLIENT_URL);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  addMessageListener(1708600002.841869, ({ id, htmlText }) => {
    res.write(`id: ${id}\n`);
    res.write(`data: ${htmlText}\n\n`);
  });

  // If client closes connection, stop sending events
  res.on("close", () => {
    console.log("client dropped me");
    removeMessageListener(1708600002.841869);
    res.end();
  });
};
