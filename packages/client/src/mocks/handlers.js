import { http, HttpResponse } from "msw";

const mockMessages = Array.from({ length: 10 }, (_, i) => ({
  id: `id${i}`,
  type: `type${i}`,
  message: `<b>bold${i + 1}</b> <i>italic${i + 1}</i> <s>strike${
    i + 1
  }</s> aoisdnfa;okjsndf;oqjnwefjoknqwefkmqawefjonveivnbaeiljvnsldijncv`,
  createdAt: new Date().toISOString(),
  isMyMessage: i % 2 === 0,
}));

export const postMessage = http.post("/1/message", async ({ request }) => {
  const reader = request.body.getReader();
  reader.read().then(function pump({ done, value }) {
    if (done) {
      return null;
    }
    console.log("received : ", new TextDecoder().decode(value));
    return reader.read().then(pump);
  });

  await setTimeout(() => {}, 3000);
  return HttpResponse.json("success");
});

export const getMessages = http.get("/1/messages", () => HttpResponse.json(mockMessages));
