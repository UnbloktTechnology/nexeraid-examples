import { createConfig, createWeb3AuthAdapter } from "@nexeraid/react-sdk";
import { createWagmiWalletConfig } from "@/features/root/identity/wagmiWallet";
import { wagmiConfig } from "@/features/root/identity/wagmiConfig";

import "@/features/root/configureReactDemoEnv";

export const nexeraIdConfig = createConfig({
  authAdapter: createWeb3AuthAdapter({
    wallet: createWagmiWalletConfig(wagmiConfig),
    generateChallenge: async (params) => {
      const challenge = await fetch("/api/kyc-airdrop/challenge", {
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
