import { createConfig, createWeb3AuthAdapter } from "@nexeraid/react-sdk";
import { createDemoAppGenerateChallengeCallback } from "@/features/root/identity/createDemoAppGenerateChallengeCallback";
import { starknetWalletConfig } from "@/features/root/web3/sdk-wallet/starknetWallet";

import "@/features/root/configureReactDemoEnv";

export const nexeraIdStarknetConfig = createConfig({
  authAdapter: createWeb3AuthAdapter({
    wallet: starknetWalletConfig,
    generateChallenge: createDemoAppGenerateChallengeCallback(
      "multi-chain-support",
    ),
  }),
});
