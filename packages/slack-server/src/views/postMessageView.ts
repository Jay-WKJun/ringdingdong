import { RequestHandler } from "express";

import {
  checkAndDecodeTokenController,
  isUserExist,
  slackMessageSendController,
} from "@/controllers/slackController";
import { CLIENT_URL } from "@/utils/env";

export const postMessage: RequestHandler = async (req, res) => {
  const _jwtToken = req.header("Authorization");
  const jwtToken = _jwtToken
    ?.replace(/^"(.*)"$/, "")
    .replace(/^Bearer[\s]*/, "");
  const message = req.body.message;
  if (!jwtToken || !message) {
    res.status(400).send("Bad Request");
    return;
  }

  const decodedToken = checkAndDecodeTokenController(jwtToken);

  if (!(await isUserExist(decodedToken))) {
    res.status(404).send("User not found");
  }

  try {
    await slackMessageSendController(decodedToken.id, message);
  } catch {
    res.status(404).send("User not found");
    return;
  }

  res.setHeader("Access-Control-Allow-Origin", CLIENT_URL);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.send({ id: decodedToken.id, message });
};
