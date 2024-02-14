import { setupWorker } from "msw/browser";

import * as handlers from "./handlers";

const worker = setupWorker(...Object.values(handlers));
(async () => worker.start())();
