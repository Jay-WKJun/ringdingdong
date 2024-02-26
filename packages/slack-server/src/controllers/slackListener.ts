import { App } from "@slack/bolt";
import slackMarkdown from "slack-markdown";

import {
  SLACK_SIGNING_SECRET,
  SLACK_BOT_TOKEN,
  SLACK_APP_TOKEN,
  MY_AVATAR_URL,
} from "@/utils/env";

const bolt = new App({
  signingSecret: SLACK_SIGNING_SECRET,
  token: SLACK_BOT_TOKEN,
  appToken: SLACK_APP_TOKEN,
  socketMode: true,
});

interface MessageListenerParam {
  id: string;
  htmlText: string;
  avatarUrl?: string;
}

type MessageListener = (messageParam: MessageListenerParam) => void;

const messageListener: { [threadId: string]: MessageListener } = {};

(async () => {
  await bolt.start();
  console.log("⚡️ Bolt app started");

  bolt.message(async ({ message }) => {
    const threadId = message.thread_ts as string;
    const type = message.type;

    // 스레드 id가 없으면 무시하기
    if (!threadId) return;
    // 메세지가 아니면 무시하기, TODO: 다른 type 메세지도 받을 수 있도록 하기
    if (type !== "message") return;

    console.log("message : ", message);

    const htmlText = slackMarkdown.toHTML(message.text as string);
    const callback = messageListener[threadId];
    console.log("htmlText", htmlText);
    callback?.({ id: message.ts, htmlText, avatarUrl: MY_AVATAR_URL });
  });

  bolt.command("/test", async ({ say }) => {
    console.log("command");
    say("test!!!");
  });
})();

export const addMessageListener = (
  threadId: number,
  callback: MessageListener,
) => {
  messageListener[threadId] = callback;
};

export const removeMessageListener = (threadId: number) => {
  delete messageListener[threadId];
};
