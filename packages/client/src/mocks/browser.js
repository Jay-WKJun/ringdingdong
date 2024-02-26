import { setupWorker } from "msw/browser";

import { handlers } from "./handlers";

if (import.meta.env.DEV) {
  const worker = setupWorker(...handlers);
  (async () => worker.start())();
}
