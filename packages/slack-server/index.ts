import 'dotenv/config';
import express from 'express';
import { WebClient, LogLevel } from '@slack/web-api';
import { App } from '@slack/bolt'

const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
  // LogLevel can be imported and used to make debugging simpler
  logLevel: LogLevel.DEBUG
});


const bolt = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

const app = express();
const port = 3000;

(async () => {
  await bolt.start()
  console.log('⚡️ Bolt app started')
})();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/slack', async (req, res) => {
  try {
    res.send('Success');
    bolt.message(async ({message, say}) => {
      console.log('message : ', message);
      say('Hello, world!');
    });
    bolt.command('/test', async ({say}) => {
      console.log('command');
      say('test!!!');
    })
  } catch {
    res.send('Error')
  }
});

app.get('/slack/events', async (req, res) => {
  try {
    client.chat.postMessage({
      channel: 'C06FK0QJKEW',
      text: 'Hello world!'
    });
    res.send('Success');
  } catch {
    res.send('Error')
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
