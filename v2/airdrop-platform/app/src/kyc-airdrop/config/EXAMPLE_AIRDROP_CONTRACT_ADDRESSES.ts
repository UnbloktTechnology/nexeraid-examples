import { EvmChainId } from "@nexeraid/react-sdk";
import {
  NEXERA_EVM_CHAINS,
  type Environment,
} from "@nexeraid/identity-schemas";
import type { Address } from "viem";

import { env } from "@/env.mjs";

export const getDistributorContractAddress = (chainId: EvmChainId | number) => {
  const chainIdParsed =
    typeof chainId === "number" ? EvmChainId.parse(chainId) : chainId;

  const distributorAddress =
    EXAMPLE_AIRDROP_CONTRACT_ADDRESSES[env.NEXT_PUBLIC_ENVIRONMENT][
      chainIdParsed
    ]?.merkleDistributorAddress;
  if (!distributorAddress) {
    throw new Error("Distributor address not found");
  }
  return distributorAddress;
};

export const getExampleTokenContractAddress = (
  chainId: EvmChainId | number,
) => {
  const chainIdParsed =
    typeof chainId === "number" ? EvmChainId.parse(chainId) : chainId;
  const tokenAddress =
    EXAMPLE_AIRDROP_CONTRACT_ADDRESSES[env.NEXT_PUBLIC_ENVIRONMENT][
      chainIdParsed
    ]?.tokenAddress;
  if (!tokenAddress) {
    throw new Error("Token address not found");
  }
  return tokenAddress;
};

// Contract addresses for different environments and chains
const EXAMPLE_AIRDROP_CONTRACT_ADDRESSES: {
  [key in Environment]: Partial<{
    [key in EvmChainId]: {
      tokenAddress: Address;
      merkleDistributorAddress: Address;
    };
  }>;
} = {
  local: {
    [NEXERA_EVM_CHAINS.SEPOLIA]: {
      tokenAddress: "0x48182d21869b874BabdeCC0851dDA4F89B18a687",
      merkleDistributorAddress: "0x96caF7D5DD0304976A070804074E453887BE509c",
    },
    [NEXERA_EVM_CHAINS.POLYGON_AMOY]: {
      tokenAddress: "0x83236b1a94AEC9f1Fd3Ad35ddf838139EA4b9729",
      merkleDistributorAddress: "0xc15BAd8De67c6b2294C8ec27694Fd12B734cE4C5",
    },
  },
  cicd: {
    [NEXERA_EVM_CHAINS.SEPOLIA]: {
      tokenAddress: "0x48182d21869b874BabdeCC0851dDA4F89B18a687",
      merkleDistributorAddress: "0x96caF7D5DD0304976A070804074E453887BE509c",
    },
    [NEXERA_EVM_CHAINS.POLYGON_AMOY]: {
      tokenAddress: "0x83236b1a94AEC9f1Fd3Ad35ddf838139EA4b9729",
      merkleDistributorAddress: "0xc15BAd8De67c6b2294C8ec27694Fd12B734cE4C5",
    },
  },
  "test-dev-1": {
    [NEXERA_EVM_CHAINS.SEPOLIA]: {
      tokenAddress: "0x48182d21869b874BabdeCC0851dDA4F89B18a687",
      merkleDistributorAddress: "0x96caF7D5DD0304976A070804074E453887BE509c",
    },
    [NEXERA_EVM_CHAINS.POLYGON_AMOY]: {
      tokenAddress: "0x6Febb483511702Ccf3a0f5a0b503C8C3D6Dd383A",
      merkleDistributorAddress: "0xefAd1faC927aBc388E8bFbEf6b97509cdb9d65BF",
    },
  },
  "test-dev-2": {
    [NEXERA_EVM_CHAINS.SEPOLIA]: {
      tokenAddress: "0x48182d21869b874BabdeCC0851dDA4F89B18a687",
      merkleDistributorAddress: "0x96caF7D5DD0304976A070804074E453887BE509c",
    },
    [NEXERA_EVM_CHAINS.POLYGON_AMOY]: {
      tokenAddress: "0x6Febb483511702Ccf3a0f5a0b503C8C3D6Dd383A",
      merkleDistributorAddress: "0xefAd1faC927aBc388E8bFbEf6b97509cdb9d65BF",
    },
  },
  dev: {
    [NEXERA_EVM_CHAINS.SEPOLIA]: {
      tokenAddress: "0x48182d21869b874BabdeCC0851dDA4F89B18a687",
      merkleDistributorAddress: "0x96caF7D5DD0304976A070804074E453887BE509c",
    },
    [NEXERA_EVM_CHAINS.POLYGON_AMOY]: {
      tokenAddress: "0x6Febb483511702Ccf3a0f5a0b503C8C3D6Dd383A",
      merkleDistributorAddress: "0xefAd1faC927aBc388E8bFbEf6b97509cdb9d65BF",
    },
  },
  stage: {
    [NEXERA_EVM_CHAINS.SEPOLIA]: {
      tokenAddress: "0x48182d21869b874BabdeCC0851dDA4F89B18a687",
      merkleDistributorAddress: "0x96caF7D5DD0304976A070804074E453887BE509c",
    },
    [NEXERA_EVM_CHAINS.POLYGON_AMOY]: {
      tokenAddress: "0x1d2CA900e97A6C12642af55B77ab57549371D87e",
      merkleDistributorAddress: "0xb2B72E04800b2121162439ab7Ecad810d8240C4E",
    },
  },
  prod: {
    [NEXERA_EVM_CHAINS.SEPOLIA]: {
      tokenAddress: "0x48182d21869b874BabdeCC0851dDA4F89B18a687",
      merkleDistributorAddress: "0x96caF7D5DD0304976A070804074E453887BE509c",
    },
    [NEXERA_EVM_CHAINS.POLYGON_AMOY]: {
      tokenAddress: "0x0220dE68E41B0131bDf2C1796a142B9D11dd11FD",
      merkleDistributorAddress: "0x9E6fDf5b83971C94B9B82658A00a4B14bC4736d1",
    },
  },
} as const;
