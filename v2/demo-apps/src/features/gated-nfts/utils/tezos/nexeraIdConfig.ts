import { createConfig, createWeb3AuthAdapter } from "@nexeraid/react-sdk";

import "@/features/root/configureReactDemoEnv";
import { tezosWalletConfig } from "@/features/root/identity/tezosWallet";

export const nexeraIdConfig = createConfig({
  authAdapter: createWeb3AuthAdapter({
    wallet: tezosWalletConfig,
    generateChallenge: async (params) => {
      const challenge = await fetch("/api/kyc/challenge", {
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
