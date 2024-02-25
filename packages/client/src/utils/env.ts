const DEV_SERVER_URL = "http://localhost:5173";

export const SERVER_URL =
  process.env.ENV === "dev"
    ? DEV_SERVER_URL
    : import.meta.env.VITE_SERVER_URL || DEV_SERVER_URL;
