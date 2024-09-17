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
import { queryClient } from "./reactQueryConfig";

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

// on widget close, immediately invalidate the query
// to prevent showing the previous user data
watchWidgetVisibleState(nexeraIdConfig, {
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
    void disconnect(nexeraIdConfig);
  },
});
watchConnections(wagmiConfig, {
  onChange: () => {
    void disconnect(nexeraIdConfig);
  },
});
