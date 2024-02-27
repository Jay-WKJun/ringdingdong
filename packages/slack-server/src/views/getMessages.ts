import { MessageElement } from "@slack/web-api/dist/types/response/ConversationsHistoryResponse";
import { RequestHandler } from "express";

import {
  checkAndDecodeTokenController,
  getSlackThreadHistories,
  isUserExist,
} from "@/controllers/slackController";
import type { Message } from "@/type";
import { CLIENT_URL, MY_AVATAR_URL } from "@/utils/env";

export const getMessages: RequestHandler = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", CLIENT_URL);

  const jwtToken = req.header("Authorization");
  if (!jwtToken) {
    res.status(400).send("Bad request");
    return;
  }

  let decodedToken;
  try {
    decodedToken = checkAndDecodeTokenController(jwtToken);
  } catch {
    res.status(401).send("Token expired or invalid");
    return;
  }

  try {
    if (!(await isUserExist(decodedToken))) {
      res.status(401).send("Unauthorized");
    }

    const messages = await getSlackThreadHistories(decodedToken.id);
    if (messages) {
      const userId = decodedToken.id;
      const responseMessages: Message[] = messages.map((message) => {
        if (message.bot_id) {
          return {
            id: message.ts ?? String(Date.now()),
            userId,
            message: message.text,
            createdAt: message.ts,
            type: message.type,
          };
        }

        const myMessage = message as MessageElement & {
          client_msg_id?: string;
        };
        return {
          id: myMessage.client_msg_id,
          message: myMessage.text,
          createdAt: myMessage.ts,
          type: myMessage.type,
          avatarUrl: MY_AVATAR_URL,
        };
      });

      res.send(responseMessages);
    } else {
      res.send([]);
    }
  } catch {
    res.status(500).send("Health check Failed");
  }
};
