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
    tokenAddress: "0xfb6c07EB480A646D222CD40581157BfB992e6480",
    merkleDistributorAddress: "0xdFDEE2E480bafa5e3f0Fd3f9004eE33c87f109EA",
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
    tokenAddress: "0xb1613704C4A2caDf19FE11fb5b5D4dc533bFBF7D",
    merkleDistributorAddress: "0x0BbC160F41f05de8CE2CC681815B3e8ED109527C",
  },
  stage: {
    tokenAddress: "0x074c15CF2242C5aC76Ee2FbD2D4123a20D4B66a5",
    merkleDistributorAddress: "0xdcfd58bDb56A0a75199b742430305620D412a0bf",
  },
  prod: {
    tokenAddress: "0x8Da4110965dE6c813E24A71457b3f1aA83148B60",
    merkleDistributorAddress: "0x113F91B96062852C828570CE2c8F0df6423e266F",
  },
} as const;
