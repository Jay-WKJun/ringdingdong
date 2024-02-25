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

  const tempId = req.body.tempId;
  const message = req.body.message;
  if (!jwtToken || !message || !tempId) {
    res.status(400).send("Bad Request");
    return;
  }

  const decodedToken = checkAndDecodeTokenController(jwtToken);
  if (!(await isUserExist(decodedToken))) {
    res.status(404).send("User not found");
  }

  try {
    const newSlackMessageResponse = await slackMessageSendController(
      decodedToken.id,
      message,
    );

    res.setHeader("Access-Control-Allow-Origin", CLIENT_URL);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    res.send({
      id: decodedToken.id,
      type: newSlackMessageResponse.channel_type as string,
      createdAt: newSlackMessageResponse.event_ts as string,
      message,
      tempId,
      userId: decodedToken.id,
    });
  } catch {
    res.status(404).send("User not found");
  }
};
