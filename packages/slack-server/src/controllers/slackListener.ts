import { App } from "@slack/bolt";
import slackMarkdown from "slack-markdown";

const bolt = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

interface MessageListenerParam {
  id: string;
  htmlText: string;
  threadId: string;
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
    callback?.({ id: message.ts, htmlText, threadId });

    console.log("htmlText", htmlText);
  });
  bolt.command("/test", async ({ say }) => {
    console.log("command");
    say("test!!!");
  });
})();

export const addMessageListener = (threadId: number, callback: MessageListener) => {
  messageListener[threadId] = callback;
};

export const removeMessageListener = (threadId: number) => {
  delete messageListener[threadId];
};