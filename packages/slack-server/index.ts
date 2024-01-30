import express from 'express';
import axios from 'axios';
import { WebClient, LogLevel } from '@slack/web-api';
import { App } from '@slack/bolt'

const client = new WebClient("xoxb-4867243917301-6531559807204-8eAQVzjzl1NCG8dsB7rdV2gu", {
  // LogLevel can be imported and used to make debugging simpler
  logLevel: LogLevel.DEBUG
});

const bolt = new App({
  signingSecret: '23145dcf0a99682f185179a08f51178c',
  token: 'xoxb-4867243917301-6531559807204-8eAQVzjzl1NCG8dsB7rdV2gu',
  appToken: 'xapp-1-A06FXMR2GSD-6523297178982-9cfa45666d12578bdaaa61ad08109dc46120a37cbd0210450c635c0d531dc42c',
  socketMode: true,
});

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/slack', async (req, res) => {
  try {
    await bolt.start()
    console.log('⚡️ Bolt app started');
    res.send('Success');
    bolt.message(async ({message, say}) => {
      console.log('message : ', message);
    });
    bolt.command('/test', async ({say}) => {
      console.log('command');
      say('test!!!');
    })
  } catch {
    res.send('Error')
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
