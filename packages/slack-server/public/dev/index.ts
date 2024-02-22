import { NativeEventSource, EventSourcePolyfill } from "event-source-polyfill";

global.EventSource = NativeEventSource || EventSourcePolyfill;
