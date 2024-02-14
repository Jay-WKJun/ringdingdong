import { http, HttpResponse, delay } from "msw";

const mockMessages = Array.from({ length: 10 }, (_, i) => ({
  id: `id${i}`,
  type: `type${i}`,
  message: `<b>bold${i + 1}</b> <i>italic${i + 1}</i> <s>strike${
    i + 1
  }</s> aoisdnfa;okjsndf;oqjnwefjoknqwefkmqawefjonveivnbaeiljvnsldijncv`,
  createdAt: new Date().toISOString(),
  isMyMessage: i % 2 === 0,
}));

// TODO: 사용자 추가 API
// TODO: 헬스체크 API
export const handlers = [
  http.get("/1/messages", () => HttpResponse.json(mockMessages)),
  http.post("/1/message", async ({ request }) => {
    const reader = request.body.getReader();
    let text;
    await reader.read().then(function pump({ done, value }) {
      if (done) {
        return null;
      }
      text = new TextDecoder().decode(value);
      return reader.read().then(pump);
    });

    console.log("text", text);

    await delay(1000);
    return HttpResponse.json("success");
  }),
];
