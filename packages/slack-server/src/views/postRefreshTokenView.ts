import { RequestHandler } from "express";

import { isUserExist, createTokenController } from "@/controllers/slackController";

export const postRefreshToken: RequestHandler = async (req, res) => {
  const id = req.body.id;
  const password = req.body.password;
  if (!password || !id) {
    res.status(400).send("Bad Request");
    return;
  }

  if (!(await isUserExist({ id, password }))) {
    res.status(404).send("User not found");
    return;
  }

  const token = createTokenController({ id, password });
  res.send({ token });
};
