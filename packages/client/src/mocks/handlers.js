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

let id = 11;

// TODO: 사용자 추가 API
// TODO: 헬스체크 API
export const handlers = [
  http.get("/health", () => new HttpResponse(null, { status: 204 })),
  http.get("/1/messages", () => HttpResponse.json(mockMessages)),
  http.post("/1/message", async ({ request }) => {
    const reader = request.body.getReader();
    let body;
    await reader.read().then(function pump({ done, value }) {
      if (done) {
        return null;
      }
      body = JSON.parse(new TextDecoder().decode(value));
      return reader.read().then(pump);
    });

    await delay(5000);
    if (Math.random() < 0.3) {
      return HttpResponse.error();
    }

    return new HttpResponse(
      JSON.stringify({
        tempId: body.tempId,
        id: id++,
        createdAt: new Date().toISOString(),
        isMyMessage: true,
        message: body.text,
        type: "message",
      }),
      { status: 200 },
    );
  }),
];
