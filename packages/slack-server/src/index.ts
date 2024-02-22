import "dotenv/config";
import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import { JsonDB, Config } from "node-json-db";
import { dirname } from "path";
import spdy from "spdy";
import { fileURLToPath } from "url";

import { slackMessageSendController } from "./controllers/slackController";

const __rootPath = process.cwd();
const __dirname = dirname(fileURLToPath(import.meta.url));

const keyName = process.env.KEY_NAME;
const certName = process.env.CERT_NAME;
const jwtSecret = process.env.JWT_SECRET || "";
const isDev = process.env.DEV === "true";

const db = new JsonDB(new Config(`${__rootPath}/db/db.json`, true, true));

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  if (isDev) {
    res.send(fs.readFileSync(`${__dirname}/index.html`, "utf8"));
    return;
  }

  res.send("Health Check Success");
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
    const recordedPassword = await db.getIndexValue("/users", id);

    if (password !== recordedPassword) {
      // 등록된게 없으면 진행 X
      res.status(401).send("Unauthorized");
    }
  } catch {
    res.status(401).send("Token expired or invalid");
  }
});

app.post("/refresh", async (req, res) => {
  // id와 password를 받아 토큰을 새로 발급하는 곳
  const id = req.body.id;
  const password = req.body.password;
  if (password === undefined || id === undefined) {
    res.status(400).send("Bad Request");
    return;
  }

  const recordedPassword = await db.getIndexValue("/users", id);

  if (password !== recordedPassword) {
    // 등록된게 없으면 진행 X
    res.status(401).send("Unauthorized");
    return;
  }

  const token = jwt.sign({ id, password }, jwtSecret, { expiresIn: "1d" });
  res.send({ token });
});

app.post("/new", async (req, res) => {
  // 새롭게 채팅을 시작하는 곳
  const id = req.body.id;
  const password = req.body.password;
  try {
    await db.push("/users", { [id]: password });
  } catch {
    res.status(500).send("Server Error");
  }
  res.send("Success");
});

app.get("/slack/sse", async (req, res) => {
  // Authorization은 받은 password로 만들어진 JWT로 확인한다.
  // JWT는 만료기한은 하루이다.
  if (!isDev) {
    const jwtToken = req.header("Authorization");
    if (!jwtToken) {
      res.status(400).send("Bad Request");
      return;
    }

    try {
      const decodedToken = jwt.verify(jwtToken, jwtSecret);
      const id = decodedToken.id;
      const password = decodedToken.password;
      const recordedPassword = await db.getIndexValue("/users", id);

      if (password !== recordedPassword) {
        // 등록된게 없으면 진행 X
        res.status(401).send("Unauthorized");
      }
    } catch {
      res.status(401).send("Token expired or invalid");
    }
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  let counter = 0;
  const interValID = setInterval(() => {
    counter++;
    if (counter > 5) {
      clearInterval(interValID);
      res.write("retry: 1000\n");
      res.end();
      return;
    }
    console.log(counter);
    res.write(`id: ${counter}\n`);
    res.write(`data: ${JSON.stringify({ num: counter })}\n\n`);
  }, 1000);

  // If client closes connection, stop sending events
  res.on("close", () => {
    console.log("client dropped me");
    clearInterval(interValID);
    res.end();
  });
});

// TODO: CORS 설정 추가 (보안 context)

app.get("/slack/send", async (req, res) => {
  try {
    await slackMessageSendController();
    res.send("Success");
  } catch {
    res.send("Error");
  }
});

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
