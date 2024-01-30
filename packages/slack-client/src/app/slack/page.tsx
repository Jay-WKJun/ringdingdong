'use client';

import { WebClient, LogLevel } from '@slack/web-api';
import { App } from '@slack/bolt'
import { useEffect } from 'react';

const client = new WebClient("xoxb-4867243917301-6531559807204-8eAQVzjzl1NCG8dsB7rdV2gu", {
  // LogLevel can be imported and used to make debugging simpler
  logLevel: LogLevel.DEBUG
});

const app = new App({
  token: 'xoxb-4867243917301-6531559807204-8eAQVzjzl1NCG8dsB7rdV2gu',
  appToken: 'Zk9OUz2lZVNyVSuJxS7CPy8u',
  socketMode: true,
});

export default function Slack() {
  useEffect(() => {
    // socket연결 해보자.
    app.start().then(() => {
      console.log('⚡️ Bolt app started');
    });
  });

  return (
    <div>
      slack
    </div>
  );
}
