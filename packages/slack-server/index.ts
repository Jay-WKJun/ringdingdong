import express from 'express';
import axios from 'axios';
import { WebClient, LogLevel } from '@slack/web-api';
import { App } from '@slack/bolt'

const client = new WebClient("", {
  // LogLevel can be imported and used to make debugging simpler
  logLevel: LogLevel.DEBUG
});

const bolt = new App({
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
