import { EventSourcePolyfill } from "event-source-polyfill";

const EventSource = EventSourcePolyfill;

function initSSEListener() {
  let eventSource: EventSource | null = null;
  const messageListeners: Set<(e: MessageEvent<unknown>) => void> = new Set();
  const openListeners: Set<(e: Event) => void> = new Set();
  const errorListeners: Set<(e: Event) => void> = new Set();

  function start(serverUrl: string, token: string) {
    if (eventSource) {
      if (eventSource.readyState !== eventSource.CLOSED) eventSource.close();
      eventSource = null;
    }

    eventSource = new EventSource(serverUrl, {
      withCredentials: true,
      headers: {
        Authorization: token,
      },
    });

    eventSource.addEventListener("open", (e) => {
      console.log("open sse connection");
      openListeners.forEach((listener) => {
        listener(e);
      });
    });

    eventSource.addEventListener("message", (e) => {
      messageListeners.forEach((listener) => {
        listener(e);
      });
    });

    eventSource.addEventListener("error", (e) => {
      console.log("sse error");
      eventSource?.close();
      errorListeners.forEach((listener) => {
        listener(e);
      });
    });
  }

  return {
    start,
    addMessageListener: (listener: (e: MessageEvent<unknown>) => void) => {
      messageListeners.add(listener);
    },
    addOpenListener: (listener: (e: Event) => void) => {
      openListeners.add(listener);
    },
    addErrorListener: (listener: (e: Event) => void) => {
      errorListeners.add(listener);
    },
    removeMessageListener: (listener: (e: MessageEvent<unknown>) => void) => {
      messageListeners.delete(listener);
    },
    removeOpenListener: (listener: (e: Event) => void) => {
      openListeners.delete(listener);
    },
    removeErrorListener: (listener: (e: Event) => void) => {
      errorListeners.delete(listener);
    },
  };
}

export const sseListener = initSSEListener();
