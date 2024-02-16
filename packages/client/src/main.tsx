import "./mocks/browser";
import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";
import { SERVER_URL } from "./utils/env";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App serverUrl={SERVER_URL} />
  </React.StrictMode>,
);
