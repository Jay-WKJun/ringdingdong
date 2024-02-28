import "dotenv/config";
import cors from "cors";
import express from "express";
import fs from "fs";
import spdy from "spdy";

import { initSlackSubscribeController } from "./controllers/slackController";
import { ROOT_PATH, CLIENT_URL, KEY_NAME, CERT_NAME, HTTP } from "./utils/env";
import {
  getAuthToken,
  postMessage,
  postRefreshToken,
  postUser,
  getHealthCheck,
  getSubscribe,
  getMessages,
} from "./views";

const app = express();
const port = 3000;

app.use(express.json());

initSlackSubscribeController();

const HOME_PATH = "/";
const homeCorsOptions = {
  origin: CLIENT_URL,
  methods: "GET, OPTIONS",
};
app.options(HOME_PATH, cors(homeCorsOptions));
app.get(HOME_PATH, cors(homeCorsOptions), getHealthCheck);

const SUBSCRIBE_PATH = "/subscribe";
const subscribeCorsOptions = {
  origin: CLIENT_URL,
  credentials: true,
  allowedHeaders: "Authorization",
  methods: "GET, OPTIONS",
};
app.options(SUBSCRIBE_PATH, cors(subscribeCorsOptions));
app.get(SUBSCRIBE_PATH, cors(subscribeCorsOptions), getSubscribe);

const MESSAGES_PATH = "/messages";
const messagesCorsOptions = {
  origin: CLIENT_URL,
  methods: "GET, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
};
app.options(MESSAGES_PATH, cors(messagesCorsOptions));
app.get(MESSAGES_PATH, cors(messagesCorsOptions), getMessages);

const AUTH_PATH = "/token/auth";
const authCorsOptions = {
  origin: CLIENT_URL,
  methods: "GET, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
};
app.options(AUTH_PATH, cors(authCorsOptions));
app.get(AUTH_PATH, cors(authCorsOptions), getAuthToken);

const REFRESH_PATH = "/token/refresh";
const refreshCorsOptions = {
  origin: CLIENT_URL,
  methods: "POST, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
};
app.options(REFRESH_PATH, cors(refreshCorsOptions));
app.post(REFRESH_PATH, cors(refreshCorsOptions), postRefreshToken);

const USER_PATH = "/user";
const userCorsOptions = {
  origin: CLIENT_URL,
  methods: "POST, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
};
app.options(USER_PATH, cors(userCorsOptions));
app.post(USER_PATH, cors(userCorsOptions), postUser);

const MESSAGE_PATH = "/message";
const messageCorsOptions = {
  origin: CLIENT_URL,
  methods: "POST, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
};
app.options(MESSAGE_PATH, cors(messageCorsOptions));
app.post(MESSAGE_PATH, cors(messageCorsOptions), postMessage);

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
