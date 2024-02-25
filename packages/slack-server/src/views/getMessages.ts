import { RequestHandler } from "express";

import {
  checkAndDecodeTokenController,
  getSlackThreadHistories,
  isUserExist,
} from "@/controllers/slackController";
import { CLIENT_URL } from "@/utils/env";

export const getMessages: RequestHandler = async (req, res) => {
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

    res.setHeader("Access-Control-Allow-Origin", CLIENT_URL);

    const messages = await getSlackThreadHistories(decodedToken.id);
    if (messages) {
      res.send(messages);
    } else {
      res.send([]);
    }
  } catch {
    res.status(500).send("Health check Failed");
  }
};
