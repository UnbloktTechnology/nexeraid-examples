import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { NexeraIdProvider } from "@nexeraid/react-sdk";
import { createAuthAdapter, createConfig } from "@nexeraid/react-sdk";
import { createSession } from "./nexera-config.ts";
const authAdapter = createAuthAdapter({ createSession });
const nexeraConfig = createConfig({ authAdapter });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NexeraIdProvider config={nexeraConfig}>
      <App />
    </NexeraIdProvider>
  </StrictMode>
);
