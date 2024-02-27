import { ChatPostMessageResponse } from "@slack/web-api";
import { RequestHandler } from "express";

import {
  checkAndDecodeTokenController,
  isUserExist,
  slackMessageSendController,
} from "@/controllers/slackController";
import { NewMessage } from "@/type";
import { CLIENT_URL } from "@/utils/env";

export const postMessage: RequestHandler = async (req, res) => {
  const jwtToken = req.header("Authorization");
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
    const newSlackThreadResponse = await slackMessageSendController(
      decodedToken.id,
      message,
    );
    const newSlackThread = newSlackThreadResponse as ChatPostMessageResponse & {
      channel_type: string;
      event_ts: string;
    };

    const newMessage: NewMessage = {
      id: decodedToken.id,
      type: newSlackThread.channel_type,
      createdAt: newSlackThread.event_ts,
      message,
      tempId,
      userId: decodedToken.id,
    };

    res.setHeader("Access-Control-Allow-Origin", CLIENT_URL);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    res.send(newMessage);
  } catch {
    res.status(404).send("User not found");
  }
};
