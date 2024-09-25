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
    tokenAddress: "0x83236b1a94AEC9f1Fd3Ad35ddf838139EA4b9729",
    merkleDistributorAddress: "0xc15BAd8De67c6b2294C8ec27694Fd12B734cE4C5",
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
    tokenAddress: "0xfc4Dbb8F9B20674dfaC0d5a01A6dD69f07fEC1E0",
    merkleDistributorAddress: "0x643336F908491c806FA52fe96fe171ae3D6BC0e1",
  },
  stage: {
    tokenAddress: "0x3BD991D9215679A2a5d5DFc5754eA3E117bD4ab7",
    merkleDistributorAddress: "0xaC91e330fE6a77944468490B0B27B829418f6DD1",
  },
  prod: {
    tokenAddress: "0xD7609E266bE7292D7FBc9766Ede5080288949F78",
    merkleDistributorAddress: "0x6F07cE622f2664248ebD72bb6b5af03Bc99dE52F",
  },
} as const;
