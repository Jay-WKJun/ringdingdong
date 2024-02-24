import "dotenv/config";
import express from "express";
import fs from "fs";
import spdy from "spdy";

import {
  checkAndDecodeTokenController,
  createNewSlackThreadController,
  createTokenController,
  isUserExist,
  slackMessageSendController,
} from "./controllers/slackController";
import { addMessageListener, removeMessageListener } from "./controllers/slackListener";
import { ROOT_PATH, CLIENT_URL, KEY_NAME, CERT_NAME } from "./utils/env";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Success");
});

app.get("/health", (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", CLIENT_URL);
    res.send("Health Check Success");
  } catch {
    res.status(500).send("Health check Failed");
  }
});

app.options("/auth", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", CLIENT_URL);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.send();
});

app.post("/auth", async (req, res) => {
  // 토큰을 확인만 하는 곳
  const jwtToken = req.header("Authorization");
  if (!jwtToken) {
    res.status(400).send("Bad request");
    return;
  }

  const decodedToken = checkAndDecodeTokenController(jwtToken);

  if (await isUserExist(decodedToken)) {
    res.status(401).send("Unauthorized");
  }
});

app.options("/refresh", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", CLIENT_URL);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.send();
});

app.post("/refresh", async (req, res) => {
  // id와 password를 받아 토큰을 새로 발급하는 곳
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
});

app.options("/new", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", CLIENT_URL);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.send();
});

app.post("/new", async (req, res) => {
  const id = req.body.id;
  const password = req.body.password;
  const description = req.body.description;
  if (!password || !id || !description) {
    res.status(400).send("Bad Request");
    return;
  }

  if (await isUserExist({ id, password })) {
    res.status(400).send("Already exist user");
    return;
  }

  try {
    await createNewSlackThreadController({ id, password, description });

    const token = createTokenController({ id, password });

    res.setHeader("Access-Control-Allow-Origin", CLIENT_URL);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.send({ token });
  } catch {
    res.status(500).send("Server Error");
  }
});

app.get("/subscribe", async (req, res) => {
  const _jwtToken = req.header("Authorization");
  const jwtToken = _jwtToken?.replace(/^"(.*)"$/, "").replace(/^Bearer[\s]*/, "");
  if (!jwtToken) {
    res.status(400).send("Bad Request");
    return;
  }

  try {
    const decodedToken = checkAndDecodeTokenController(jwtToken);

    if (!(await isUserExist(decodedToken))) {
      res.status(401).send("Unauthorized");
    }
  } catch {
    res.status(401).send("Token expired or invalid");
  }

  res.setHeader("Access-Control-Allow-Origin", CLIENT_URL);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  addMessageListener(1708600002.841869, ({ id, htmlText }) => {
    res.write(`id: ${id}\n`);
    res.write(`data: ${htmlText}\n\n`);
  });

  // If client closes connection, stop sending events
  res.on("close", () => {
    console.log("client dropped me");
    removeMessageListener(1708600002.841869);
    res.end();
  });
});

app.options("/send", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", CLIENT_URL);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.send();
});

app.post("/send", async (req, res) => {
  const _jwtToken = req.header("Authorization");
  const jwtToken = _jwtToken?.replace(/^"(.*)"$/, "").replace(/^Bearer[\s]*/, "");
  const message = req.body.message;
  if (!jwtToken || !message) {
    res.status(400).send("Bad Request");
    return;
  }

  const decodedToken = checkAndDecodeTokenController(jwtToken);

  if (!(await isUserExist(decodedToken))) {
    res.status(404).send("User not found");
  }

  try {
    await slackMessageSendController(decodedToken.id, message);
  } catch {
    res.status(404).send("User not found");
    return;
  }

  res.setHeader("Access-Control-Allow-Origin", CLIENT_URL);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.send({ id: decodedToken.id, message });
});

const server = spdy.createServer(
  {
    key: fs.readFileSync(`${ROOT_PATH}/${KEY_NAME}`),
    cert: fs.readFileSync(`${ROOT_PATH}/${CERT_NAME}`),
    spdy: {
      protocols: ["h2"],
    },
  },
  app,
);

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log("SSL enabled");
});
