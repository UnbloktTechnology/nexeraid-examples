import {
  createConfig,
  createWeb3AuthAdapter,
  disconnect,
  watchWidgetVisibleState,
} from "@compilot/react-sdk";
import { createWagmiWalletAdapter } from "@compilot/web-sdk-wallet-wagmi";
import { wagmiConfig } from "@/wagmiConfig";

import "@/configureDemoEnv";
import { watchAccount, watchConnections } from "wagmi/actions";
import { queryClient } from "./reactQueryConfig";

export const compilotConfig = createConfig({
  authAdapter: createWeb3AuthAdapter({
    wallet: createWagmiWalletAdapter(wagmiConfig),
    generateChallenge: async (params) => {
      const challenge = await fetch("/api/compilot/generate-challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      return challenge.json();
    },
    verifyChallenge: async (params) => {
      const challenge = await fetch("/api/compilot/verify-challenge", {
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

// on widget close, immediately invalidate the query
// to prevent showing the previous user data
watchWidgetVisibleState(compilotConfig, {
  onChange: (visible) => {
    if (!visible) {
      void queryClient.invalidateQueries();
    }
  },
});
// listen for wallet changes and disconnect the instance
// when that's the case
watchAccount(wagmiConfig, {
  onChange: () => {
    void disconnect(compilotConfig);
  },
});
watchConnections(wagmiConfig, {
  onChange: () => {
    void disconnect(compilotConfig);
  },
});
