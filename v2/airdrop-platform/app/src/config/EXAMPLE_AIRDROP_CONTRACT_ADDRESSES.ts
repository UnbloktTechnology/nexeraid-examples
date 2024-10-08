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
    tokenAddress: "0xCB5fa74A8a801395018CA6188C5d816640AAE61F",
    merkleDistributorAddress: "0x6D30524AA5245E3217AA57560745eE160ad96046",
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
    tokenAddress: "0x5105b86d8af3FEC9D46dB7e53fecc1279c96b01c",
    merkleDistributorAddress: "0x5cd53312fCf2377B3a20cA2C1ED834683e33c3F6",
  },
  stage: {
    tokenAddress: "0x4934A2228391C1E6b05E1e298EB23412F224d6a9",
    merkleDistributorAddress: "0x819141eCB55A9Bfb77Bfbc4E0F31B1057561D2B4",
  },
  prod: {
    tokenAddress: "0x1395EF19a2d45bcD99A39C526dE91042B62CcE87",
    merkleDistributorAddress: "0x8c26A4dd27EcECf1AeD1121230469Eb80609D9a3",
  },
} as const;
