import { createConfig, createWeb3AuthAdapter } from "@nexeraid/react-sdk";
import { createDemoAppGenerateChallengeCallback } from "@/features/root/identity/createDemoAppGenerateChallengeCallback";
import { polkadotWalletConfig } from "@/features/root/web3/sdk-wallet/polkadotWallet";

import "@/features/root/configureReactDemoEnv";

export const nexeraIdPolkadotConfig = createConfig({
  authAdapter: createWeb3AuthAdapter({
    wallet: polkadotWalletConfig,
    generateChallenge: createDemoAppGenerateChallengeCallback(
      "multi-chain-support",
    ),
  }),
});
