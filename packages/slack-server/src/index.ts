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
app.use(cors({ origin: CLIENT_URL }));

initSlackSubscribeController();

app.get(
  "/",
  cors({
    origin: CLIENT_URL,
    methods: "GET, OPTIONS",
  }),
  (req, res) => {
    res.send("Success");
  },
);

app.get(
  "/health",
  cors({
    origin: CLIENT_URL,
    methods: "GET, OPTIONS",
  }),
  getHealthCheck,
);

app.get(
  "/subscribe",
  cors({
    origin: CLIENT_URL,
    credentials: true,
    allowedHeaders: "Authorization",
    methods: "GET, OPTIONS",
  }),
  getSubscribe,
);

app.get(
  "/messages",
  cors({
    origin: CLIENT_URL,
    methods: "GET, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  }),
  getMessages,
);

app.get(
  "/token/auth",
  cors({
    origin: CLIENT_URL,
    methods: "GET, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  }),
  getAuthToken,
);

app.post(
  "/token/refresh",
  cors({
    origin: CLIENT_URL,
    methods: "POST, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  }),
  postRefreshToken,
);

app.post(
  "/user",
  cors({
    origin: CLIENT_URL,
    methods: "POST, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  }),
  postUser,
);

app.post(
  "/message",
  cors({
    origin: CLIENT_URL,
    methods: "POST, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  }),
  postMessage,
);

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
