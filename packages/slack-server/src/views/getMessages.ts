import { RequestHandler } from "express";

import {
  checkAndDecodeTokenController,
  getSlackThreadHistories,
  isUserExist,
} from "@/controllers/slackController";
import { CLIENT_URL, MY_AVATAR_URL } from "@/utils/env";

export const getMessages: RequestHandler = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", CLIENT_URL);

  const jwtToken = req.header("Authorization");
  if (!jwtToken) {
    res.status(400).send("Bad request");
    return;
  }

  const decodedToken = checkAndDecodeTokenController(jwtToken);

  try {
    if (!(await isUserExist(decodedToken))) {
      res.status(401).send("Unauthorized");
    }

    const messages = await getSlackThreadHistories(decodedToken.id);
    if (messages) {
      const userId = decodedToken.id;
      res.send(
        messages.map((message) => {
          if (message.bot_id) {
            return {
              id: message.client_msg_id ?? message.ts,
              userId,
              message: message.text,
              createdAt: message.ts,
              type: message.type,
            };
          }

          return {
            id: message.client_msg_id!,
            message: message.text,
            createdAt: message.ts,
            type: message.type,
            avatarUrl: MY_AVATAR_URL,
          };
        }),
      );
    } else {
      res.send([]);
    }
  } catch {
    res.status(500).send("Health check Failed");
  }
};
