import { WebClient, LogLevel } from "@slack/web-api";

const botToken = process.env.SLACK_BOT_TOKEN as string;
const channel = process.env.SLACK_CHANNEL_ID as string;

const client = new WebClient(botToken, {
  // LogLevel can be imported and used to make debugging simpler
  logLevel: LogLevel.DEBUG,
});

interface SlackThreadCreateControllerParam {
  id: string;
  description: string;
}

export async function createNewSlackThreadController({ id, description }: SlackThreadCreateControllerParam) {
  try {
    // 새로운 스레드를 만든다.
    await client.chat.postMessage({
      channel,
      text: `✋ id: ${id}\n\n😁 Introduce: ${description}`,
    });
  } catch {
    throw new Error("Slack Thread Create Error");
  }
}

interface MessagePostControllerParam {
  text: string;
  threadId: string;
}

export async function slackMessageSendController({ text, threadId }: MessagePostControllerParam) {
  try {
    await client.chat.postMessage({
      channel,
      thread_ts: threadId,
      text,
    });
  } catch (e) {
    throw new Error("Slack Message POST Error");
  }
}
