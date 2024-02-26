import { WebClient } from "@slack/web-api";

import { SLACK_BOT_ID, SLACK_BOT_TOKEN, SLACK_CHANNEL_ID } from "@/utils/env";

const client = new WebClient(SLACK_BOT_TOKEN, {
  // LogLevel can be imported and used to make debugging simpler
  // logLevel: LogLevel.DEBUG,
});

export async function getBotsInfo() {
  try {
    return client.bots.info({
      token: SLACK_BOT_TOKEN,
      bot: SLACK_BOT_ID,
    });
  } catch {
    throw new Error("Slack Bot Info Error");
  }
}

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
    return client.chat.postMessage({
      channel: SLACK_CHANNEL_ID,
      thread_ts: threadId,
      text,
    });
  } catch (e) {
    throw new Error("Slack Message POST Error");
  }
}

async function getSlackThreadId(threadId: string) {
  try {
    const result = await client.conversations.history({
      channel: SLACK_CHANNEL_ID,
    });

    const conversationHistory = result.messages;

    const targetThread = conversationHistory?.find(
      (history) => history.ts === threadId,
    );
    if (targetThread) {
      return targetThread.ts;
    }

    return null;
  } catch (error) {
    throw new Error("Slack Thread Id GET Error");
  }
}

export async function getSlackThreadMessages(threadId: string) {
  const slackThreadId = getSlackThreadId(threadId);
  if (!slackThreadId) return null;

  try {
    const result = await client.conversations.replies({
      channel: SLACK_CHANNEL_ID,
      ts: threadId,
    });
    console.log("result", result);
    const conversationHistory = result.messages;

    return conversationHistory;
  } catch (error) {
    throw new Error("Slack Thread Messages GET Error");
  }
}
