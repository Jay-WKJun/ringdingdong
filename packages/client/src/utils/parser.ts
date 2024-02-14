import { Parser as _Parser } from "html-to-react";

// @ts-expect-error: no type provided from html-to-react
export const Parser = new _Parser() as { parse: (html: string) => JSX.Element[] };
