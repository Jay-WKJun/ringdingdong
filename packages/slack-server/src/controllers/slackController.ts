import { App } from "@slack/bolt";
import { WebClient, LogLevel } from "@slack/web-api";
import slackMarkdown from "slack-markdown";

const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
  // LogLevel can be imported and used to make debugging simpler
  logLevel: LogLevel.DEBUG,
});

const bolt = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

(async () => {
  await bolt.start();
  console.log("⚡️ Bolt app started");

  bolt.message(async ({ message, say }) => {
    console.log("message : ", message);
    say("Hello, world!");
    console.log(slackMarkdown.toHTML(message.text as string));
  });
  bolt.command("/test", async ({ say }) => {
    console.log("command");
    say("test!!!");
  });
})();

export async function slackMessageSendController() {
  try {
    client.chat.postMessage({
      channel: "C06FK0QJKEW",
      text: `**Hello world!**
      _zxcv_
      ~asdf~
        • asdf
        1. xzcv
      `,
    });
  } catch (e) {
    throw new Error("Slack Message Error");
  }
}
