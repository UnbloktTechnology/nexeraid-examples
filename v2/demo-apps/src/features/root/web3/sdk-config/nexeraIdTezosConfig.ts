import { createConfig, createWeb3AuthAdapter } from "@nexeraid/react-sdk";
import { createDemoAppGenerateChallengeCallback } from "@/features/root/identity/createDemoAppGenerateChallengeCallback";
import { tezosWalletConfig } from "@/features/root/web3/sdk-wallet/tezosWallet";

import "@/features/root/configureReactDemoEnv";

export const nexeraIdTezosConfig = createConfig({
  authAdapter: createWeb3AuthAdapter({
    wallet: tezosWalletConfig,
    generateChallenge: createDemoAppGenerateChallengeCallback(
      "multi-chain-support",
    ),
  }),
});
