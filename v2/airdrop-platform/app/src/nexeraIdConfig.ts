import {
  createConfig,
  createWeb3AuthAdapter,
  disconnect,
  watchWidgetVisibleState,
} from "@nexeraid/react-sdk";
import { createWagmiWalletAdapter } from "@nexeraid/react-sdk-wallet-wagmi";
import { wagmiConfig } from "@/wagmiConfig";

import "@/configureDemoEnv";
import { watchAccount, watchConnections } from "wagmi/actions";

export const nexeraIdConfig = createConfig({
  authAdapter: createWeb3AuthAdapter({
    wallet: createWagmiWalletAdapter(wagmiConfig),
    generateChallenge: async (params) => {
      const challenge = await fetch("/api/nexera/challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      return challenge.json();
    },
  }),
});

// when the web2 widget is not visible anymore, disconnect the instance
watchWidgetVisibleState(nexeraIdConfig, {
  onChange: (isVisible) => {
    if (!isVisible) {
      void disconnect(nexeraIdConfig);
    }
  },
});
// listen for wallet changes and disconnect the instance
watchAccount(wagmiConfig, {
  onChange: () => {
    void disconnect(nexeraIdConfig);
  },
});
watchConnections(wagmiConfig, {
  onChange: () => {
    void disconnect(nexeraIdConfig);
  },
});
