import { createConfig, createWeb3AuthAdapter } from "@nexeraid/react-sdk";
import { createWagmiWalletAdapter } from "@nexeraid/react-sdk-wallet-wagmi";
import { wagmiConfig } from "@/features/root/identity/wagmiConfig";

import "@/features/root/configureReactDemoEnv";

export const nexeraIdConfig = createConfig({
  authAdapter: createWeb3AuthAdapter({
    wallet: createWagmiWalletAdapter(wagmiConfig),
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
