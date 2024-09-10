import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { NexeraIdProvider } from "@nexeraid/react-sdk";
import { createAuthAdapter, createConfig } from "@nexeraid/react-sdk";
import { createSession } from "./nexera-config.ts";


// this is for internal nexeraid use only
import { _setInternalConfig as _setInternalConfigReact } from "@nexeraid/react-sdk";
import { _setInternalConfig as _setInternalConfigNode } from "@nexeraid/js-sdk";

console.log("_setInternalConfigReact", { env: 'dev' });
_setInternalConfigReact({ env: 'dev' });
console.log("_setInternalConfigNode", { env: 'dev' });
_setInternalConfigNode({ env: 'dev' });

const authAdapter = createAuthAdapter({ createSession });
const nexeraConfig = createConfig({ authAdapter });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NexeraIdProvider config={nexeraConfig}>
      <App /></NexeraIdProvider>
  </StrictMode>,
)
