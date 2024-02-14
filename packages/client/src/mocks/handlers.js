import { http, HttpResponse } from "msw";

export const test = http.get("/fruits", () => HttpResponse.json(["Tom", "Jerry", "Spike"]));
