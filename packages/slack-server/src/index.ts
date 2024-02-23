import "dotenv/config";
import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import { JsonDB, Config } from "node-json-db";
import spdy from "spdy";

import { createNewSlackThreadController, slackMessageSendController } from "./controllers/slackController";
import { addMessageListener, removeMessageListener } from "./controllers/slackListener";

const __rootPath = process.cwd();

const clientUrl = process.env.CLIENT_URL || "";
const keyName = process.env.KEY_NAME;
const certName = process.env.CERT_NAME;
const jwtSecret = process.env.JWT_SECRET || "";

const db = new JsonDB(new Config(`${__rootPath}/db/db.json`, true, true));

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Success");
});

app.get("/health", (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", clientUrl);
    res.send("Health Check Success");
  } catch {
    res.status(500).send("Health check Failed");
  }
});

app.options("/auth", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", clientUrl);
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

  try {
    const decodedToken = jwt.verify(jwtToken, jwtSecret);
    const id = decodedToken.id;
    const password = decodedToken.password;
    const recordedUserInfo = await getUserInfo(id);
    const recordedPassword = recordedUserInfo.password;

    if (password !== recordedPassword) {
      // 등록된게 없으면 진행 X
      res.status(401).send("Unauthorized");
    }
  } catch {
    res.status(401).send("Token expired or invalid");
  }
});

app.options("/refresh", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", clientUrl);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.send();
});

app.post("/refresh", async (req, res) => {
  // id와 password를 받아 토큰을 새로 발급하는 곳
  const id = req.body.id;
  const password = req.body.password;
  if (password === undefined || id === undefined) {
    res.status(400).send("Bad Request");
    return;
  }

  const recordedUserInfo = await getUserInfo(id);
  const recordedPassword = recordedUserInfo.password;

  if (password !== recordedPassword) {
    // 등록된게 없으면 진행 X
    res.status(401).send("Unauthorized");
    return;
  }

  const token = jwt.sign({ id, password }, jwtSecret, { expiresIn: "1d" });
  res.send({ token });
});

app.options("/new", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", clientUrl);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.send();
});

app.post("/new", async (req, res) => {
  // 새롭게 채팅을 시작하는 곳
  const id = req.body.id;
  const password = req.body.password;
  const description = req.body.description;
  try {
    await db.getData(`/users/${id}`);
  } catch {
    res.status(400).send("Already exist user");
    return;
  }

  try {
    const newThread = await createNewSlackThreadController({ id, description });
    const threadId = newThread.ts as string;
    await db.push(`/users/${id}`, JSON.stringify({ id, password, threadId }));

    res.setHeader("Access-Control-Allow-Origin", clientUrl);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    const token = jwt.sign({ id, password }, jwtSecret, { expiresIn: "1d" });
    res.send({ token });
  } catch {
    res.status(500).send("Server Error");
  }
});

app.get("/slack/sse", async (req, res) => {
  const jwtToken = req.header("Authorization");
  if (!jwtToken) {
    res.status(400).send("Bad Request");
    return;
  }

  try {
    const decodedToken = jwt.verify(jwtToken, jwtSecret);
    const id = decodedToken.id;
    const password = decodedToken.password;
    const recordedUserInfo = await getUserInfo(id);
    const recordedPassword = recordedUserInfo.password;

    if (password !== recordedPassword) {
      // 등록된게 없으면 진행 X
      res.status(401).send("Unauthorized");
    }
  } catch {
    res.status(401).send("Token expired or invalid");
  }

  res.setHeader("Access-Control-Allow-Origin", clientUrl);
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
  res.setHeader("Access-Control-Allow-Origin", clientUrl);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.send();
});

app.post("/send", async (req, res) => {
  const _jwtToken = req.header("Authorization");
  const message = req.body.message;
  if (!_jwtToken) {
    res.status(400).send("Bad Request");
    return;
  }
  const jwtToken = _jwtToken.replace(/^"(.*)"$/, "").replace(/^Bearer[\s]*/, "");
  if (!message) {
    res.status(400).send("Bad Request");
    return;
  }

  const decodedToken = jwt.verify(jwtToken, jwtSecret);
  let recordedThreadId;

  try {
    const id = decodedToken.id;
    const password = decodedToken.password;
    const recordedUserInfo = await getUserInfo(id);
    const recordedPassword = recordedUserInfo.password;
    recordedThreadId = recordedUserInfo.threadId;

    if (password !== recordedPassword) {
      // 등록된게 없으면 진행 X
      res.status(401).send("Unauthorized");
    }
  } catch {
    res.status(401).send("Token expired or invalid");
  }

  res.setHeader("Access-Control-Allow-Origin", clientUrl);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  try {
    await slackMessageSendController({ text: message, threadId: recordedThreadId });
    res.send("Success");
  } catch {
    res.send("Error");
  }
});

async function getUserInfo(id: string) {
  return JSON.parse((await db.getData(`/users/${id}`)) as string);
}

const server = spdy.createServer(
  {
    key: fs.readFileSync(`${__rootPath}/${keyName}`),
    cert: fs.readFileSync(`${__rootPath}/${certName}`),
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

async function test() {
  const aa = await db.getData("/test");
  console.log("aa", aa);
}
test();
