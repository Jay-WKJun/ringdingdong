import { RequestHandler } from "express";

import {
  createNewSlackThreadController,
  createTokenController,
  isUserExist,
} from "@/controllers/slackController";
import { CLIENT_URL } from "@/utils/env";

export const postUser: RequestHandler = async (req, res) => {
  const id = req.body.id;
  const password = req.body.password;
  const description = req.body.description;

  if (!password || !id || !description) {
    res.status(400).send("Bad Request");
    return;
  }

  if (await isUserExist({ id, password })) {
    res.status(403).send("User Exist");
    return;
  }

  try {
    await createNewSlackThreadController({ id, password, description });

    const token = createTokenController({ id, password });

    res.setHeader("Access-Control-Allow-Origin", CLIENT_URL);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    res.send({ token });
  } catch {
    res.status(500).send("Server Error");
  }
};
