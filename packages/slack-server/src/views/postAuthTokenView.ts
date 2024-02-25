import { RequestHandler } from "express";

import {
  checkAndDecodeTokenController,
  isUserExist,
} from "@/controllers/slackController";

export const postAuthToken: RequestHandler = async (req, res) => {
  const jwtToken = req.header("Authorization");
  if (!jwtToken) {
    res.status(400).send("Bad request");
    return;
  }

  const decodedToken = checkAndDecodeTokenController(jwtToken);

  if (await isUserExist(decodedToken)) {
    res.status(401).send("Unauthorized");
  }
};
