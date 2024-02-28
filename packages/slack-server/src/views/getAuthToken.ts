import { RequestHandler } from "express";

import {
  checkAndDecodeTokenController,
  isUserExist,
} from "@/controllers/slackController";

export const getAuthToken: RequestHandler = async (req, res) => {
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

  if (!(await isUserExist(decodedToken))) {
    res.status(401).send("Unauthorized");
    return;
  }

  res.status(204).send();
};
