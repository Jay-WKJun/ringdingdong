import { RequestHandler } from "express";

import { CLIENT_URL } from "@/utils/env";

export const getHealthCheck: RequestHandler = async (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", CLIENT_URL);
    res.send("Health Check Success");
  } catch {
    res.status(500).send("Health check Failed");
  }
};
