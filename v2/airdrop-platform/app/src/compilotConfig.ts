import { createConfig, createWeb3AuthAdapter } from "@compilot/react-sdk";
import { createWagmiWalletAdapter } from "@compilot/web-sdk-wallet-wagmi";
import { wagmiConfig } from "@/wagmiConfig";

import "@/configureDemoEnv";

export const compilotWalletAdapter = createWagmiWalletAdapter(wagmiConfig);
export const compilotConfig = createConfig({
  authAdapter: createWeb3AuthAdapter({
    wallet: compilotWalletAdapter,
    generateChallenge: async (params) => {
      const challenge = await fetch("/api/generate-challenge", {
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
