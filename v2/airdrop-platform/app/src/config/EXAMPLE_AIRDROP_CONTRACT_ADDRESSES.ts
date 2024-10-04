import { type Environment } from "@nexeraid/identity-schemas";
import type { Address } from "viem";

import { env } from "@/env.mjs";
import { EvmChainId } from "@compilot/react-sdk";

export const getDistributorContractAddress = () => {
  const distributorAddress =
    EXAMPLE_AIRDROP_CONTRACT_ADDRESSES[env.NEXT_PUBLIC_ENVIRONMENT]
      ?.merkleDistributorAddress;
  if (!distributorAddress) {
    throw new Error("Distributor address not found");
  }
  return distributorAddress;
};

export const getAirdropTokenConfig = () => {
  const tokenAddress =
    EXAMPLE_AIRDROP_CONTRACT_ADDRESSES[env.NEXT_PUBLIC_ENVIRONMENT]
      ?.tokenAddress;
  if (!tokenAddress) {
    throw new Error("Token address not found");
  }
  return { address: tokenAddress, symbol: "PEAQ", decimals: 18 };
};

export const getDeploymentChain = () => {
  return { id: 80002, name: "Polygon Amoy", parsedId: EvmChainId.parse(80002) };
};

// Contract addresses for different environments and chains
const EXAMPLE_AIRDROP_CONTRACT_ADDRESSES: {
  [key in Environment]: Partial<{
    tokenAddress: Address;
    merkleDistributorAddress: Address;
  }>;
} = {
  local: {
    tokenAddress: "0x796bAEEa31C98df2749f02Ee29AC3717837214E4",
    merkleDistributorAddress: "0xB0b53bf83946D4491afE886CEdD299D6C999d7A7",
  },
  cicd: {
    tokenAddress: "0x83236b1a94AEC9f1Fd3Ad35ddf838139EA4b9729",
    merkleDistributorAddress: "0xc15BAd8De67c6b2294C8ec27694Fd12B734cE4C5",
  },
  "test-dev-1": {
    tokenAddress: "0x6Febb483511702Ccf3a0f5a0b503C8C3D6Dd383A",
    merkleDistributorAddress: "0xefAd1faC927aBc388E8bFbEf6b97509cdb9d65BF",
  },
  "test-dev-2": {
    tokenAddress: "0x6Febb483511702Ccf3a0f5a0b503C8C3D6Dd383A",
    merkleDistributorAddress: "0xefAd1faC927aBc388E8bFbEf6b97509cdb9d65BF",
  },
  dev: {
    tokenAddress: "0x46828dC9Fe28030946207a9Fc42aBb5f3d31746b",
    merkleDistributorAddress: "0x067Ffa12D9835e7197AdCD84D4d62EEB010985F0",
  },
  stage: {
    tokenAddress: "0xA6bCBf71C530a7092a758e73688F1c79C055F0A3",
    merkleDistributorAddress: "0xe41F70A388B7Cc2eF88A534Ac8E03d188976866a",
  },
  prod: {
    tokenAddress: "0x7b8a0573AA4c60Ce126EE7BDB1FF3F9eE64AfaF7",
    merkleDistributorAddress: "0x6d5D47218680D24Aeb40B6ac193690b64b39b552",
  },
} as const;
