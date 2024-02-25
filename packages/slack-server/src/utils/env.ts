export const ROOT_PATH = process.cwd() || "";

export const CLIENT_URL = process.env.CLIENT_URL || "";
export const KEY_NAME = process.env.KEY_NAME;
export const CERT_NAME = process.env.CERT_NAME;
export const JWT_SECRET = process.env.JWT_SECRET || "";
export const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN as string;
export const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID as string;
export const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
export const SLACK_APP_TOKEN = process.env.SLACK_APP_TOKEN;

export const HTTP = process.env.HTTP;
