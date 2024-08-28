import { createConfig, createWeb3AuthAdapter } from "@nexeraid/react-sdk";
import { createWagmiWalletConfig } from "@/features/root/web3/sdk-wallet/wagmiWallet";
import { createDemoAppGenerateChallengeCallback } from "@/features/root/identity/createDemoAppGenerateChallengeCallback";
import { wagmiConfig } from "@/features/root/web3/wagmiConfig";

import "@/features/root/configureReactDemoEnv";

export const createDemoWeb3WagmiSdkConfig = (
  demoApp:
    | "multi-chain-support"
    | "bank"
    | "bank-kyb"
    | "bank-web3"
    | "defi-offchain-zkp"
    | "defi-rule-engine"
    | "kyc",
) =>
  createConfig({
    authAdapter: createWeb3AuthAdapter({
      wallet: createWagmiWalletConfig(wagmiConfig),
      generateChallenge: createDemoAppGenerateChallengeCallback(demoApp),
    }),
  });
