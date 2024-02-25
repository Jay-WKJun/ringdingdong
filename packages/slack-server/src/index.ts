import "dotenv/config";
import express from "express";
import fs from "fs";
import spdy from "spdy";

import { ROOT_PATH, CLIENT_URL, KEY_NAME, CERT_NAME, HTTP } from "./utils/env";
import {
  postAuthToken,
  postMessage,
  postRefreshToken,
  postUser,
  getHealthCheck,
  getSubscribe,
} from "./views";
import { getMessages } from "./views/getMessages";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  console.log("home req come");
  res.send("Success");
});

app.get("/health_check", getHealthCheck);

app.get("/subscribe", getSubscribe);

app.get("/messages", getMessages);

app.options("/auth_token", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", CLIENT_URL);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.send();
});

app.post("/auth_token", postAuthToken);

app.options("/refresh_token", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", CLIENT_URL);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.send();
});

app.post("/refresh_token", postRefreshToken);

app.options("/user", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", CLIENT_URL);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.send();
});

app.post("/user", postUser);

app.options("/message", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", CLIENT_URL);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.send();
});

app.post("/message", postMessage);

const isHTTP1 = HTTP === "1";

const server = isHTTP1
  ? app
  : spdy.createServer(
      {
        key: fs.readFileSync(`${ROOT_PATH}/${KEY_NAME}`),
        cert: fs.readFileSync(`${ROOT_PATH}/${CERT_NAME}`),
        spdy: {
          protocols: ["h2"],
        },
      },
      app,
    );

const protocol = isHTTP1 ? "http" : "https";

server.listen(port, () => {
  console.log(`Server is running at ${protocol}://localhost:${port}`);
  if (!isHTTP1) console.log("SSL enabled");
});
