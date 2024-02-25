import { WebClient, LogLevel } from "@slack/web-api";

import { SLACK_BOT_TOKEN, SLACK_CHANNEL_ID } from "@/utils/env";

const client = new WebClient(SLACK_BOT_TOKEN, {
  // LogLevel can be imported and used to make debugging simpler
  logLevel: LogLevel.DEBUG,
});

interface CreateNewSlackThreadParam {
  id: string;
  description: string;
}

export function createNewSlackThread({
  id,
  description,
}: CreateNewSlackThreadParam) {
  try {
    return client.chat.postMessage({
      channel: SLACK_CHANNEL_ID,
      text: `✋ id: ${id}\n\n😁 Introduce: ${description}`,
    });
  } catch {
    throw new Error("Slack Thread Create Error");
  }
}

interface SendSlackMessageParam {
  text: string;
  threadId: string;
}

export async function sendSlackMessage({
  text,
  threadId,
}: SendSlackMessageParam) {
  try {
    await client.chat.postMessage({
      channel: SLACK_CHANNEL_ID,
      thread_ts: threadId,
      text,
    });
  } catch (e) {
    throw new Error("Slack Message POST Error");
  }
}
