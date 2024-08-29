import { createConfig, createWeb3AuthAdapter } from "@nexeraid/react-sdk";
import { createDemoAppGenerateChallengeCallback } from "@/features/root/identity/createDemoAppGenerateChallengeCallback";
import { agungWalletConfig } from "@/features/root/web3/sdk-wallet/agungWallet";

import "@/features/root/configureReactDemoEnv";

export const nexeraIdAgungConfig = createConfig({
  authAdapter: createWeb3AuthAdapter({
    wallet: agungWalletConfig,
    generateChallenge: createDemoAppGenerateChallengeCallback(
      "multi-chain-support",
    ),
  }),
});
