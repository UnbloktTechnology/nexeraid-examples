import { EvmChainId } from "@nexeraid/identity-schemas";
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
    ]?.distributor;
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
    ]?.token;
  if (!tokenAddress) {
    throw new Error("Token address not found");
  }
  return tokenAddress;
};

// Contract addresses for different environments and chains
const EXAMPLE_AIRDROP_CONTRACT_ADDRESSES: {
  [key in Environment]: Partial<{
    [key in EvmChainId]: { token: Address; distributor: Address };
  }>;
} = {
  prod: {
    [NEXERA_EVM_CHAINS.SEPOLIA]: {
      token: "0x48182d21869b874BabdeCC0851dDA4F89B18a687",
      distributor: "0x96caF7D5DD0304976A070804074E453887BE509c",
    },
    [NEXERA_EVM_CHAINS.POLYGON_AMOY]: {
      token: "0x48182d21869b874BabdeCC0851dDA4F89B18a687",
      distributor: "0x96caF7D5DD0304976A070804074E453887BE509c",
    },
  },
  local: {
    [NEXERA_EVM_CHAINS.SEPOLIA]: {
      token: "0x48182d21869b874BabdeCC0851dDA4F89B18a687",
      distributor: "0x96caF7D5DD0304976A070804074E453887BE509c",
    },
    [NEXERA_EVM_CHAINS.POLYGON_AMOY]: {
      token: "0x83236b1a94AEC9f1Fd3Ad35ddf838139EA4b9729",
      distributor: "0xc15BAd8De67c6b2294C8ec27694Fd12B734cE4C5",
    },
  },
  cicd: {
    [NEXERA_EVM_CHAINS.SEPOLIA]: {
      token: "0x48182d21869b874BabdeCC0851dDA4F89B18a687",
      distributor: "0x96caF7D5DD0304976A070804074E453887BE509c",
    },
    [NEXERA_EVM_CHAINS.POLYGON_AMOY]: {
      token: "0x83236b1a94AEC9f1Fd3Ad35ddf838139EA4b9729",
      distributor: "0xc15BAd8De67c6b2294C8ec27694Fd12B734cE4C5",
    },
  },
  "test-dev-1": {
    [NEXERA_EVM_CHAINS.SEPOLIA]: {
      token: "0x48182d21869b874BabdeCC0851dDA4F89B18a687",
      distributor: "0x96caF7D5DD0304976A070804074E453887BE509c",
    },
    [NEXERA_EVM_CHAINS.POLYGON_AMOY]: {
      token: "0x83236b1a94AEC9f1Fd3Ad35ddf838139EA4b9729",
      distributor: "0xc15BAd8De67c6b2294C8ec27694Fd12B734cE4C5",
    },
  },
  "test-dev-2": {
    [NEXERA_EVM_CHAINS.SEPOLIA]: {
      token: "0x48182d21869b874BabdeCC0851dDA4F89B18a687",
      distributor: "0x96caF7D5DD0304976A070804074E453887BE509c",
    },
    [NEXERA_EVM_CHAINS.POLYGON_AMOY]: {
      token: "0x83236b1a94AEC9f1Fd3Ad35ddf838139EA4b9729",
      distributor: "0xc15BAd8De67c6b2294C8ec27694Fd12B734cE4C5",
    },
  },
  dev: {
    [NEXERA_EVM_CHAINS.SEPOLIA]: {
      token: "0x48182d21869b874BabdeCC0851dDA4F89B18a687",
      distributor: "0x96caF7D5DD0304976A070804074E453887BE509c",
    },
    [NEXERA_EVM_CHAINS.POLYGON_AMOY]: {
      token: "0x83236b1a94AEC9f1Fd3Ad35ddf838139EA4b9729",
      distributor: "0xc15BAd8De67c6b2294C8ec27694Fd12B734cE4C5",
    },
  },
  stage: {
    [NEXERA_EVM_CHAINS.SEPOLIA]: {
      token: "0x48182d21869b874BabdeCC0851dDA4F89B18a687",
      distributor: "0x96caF7D5DD0304976A070804074E453887BE509c",
    },
    [NEXERA_EVM_CHAINS.POLYGON_AMOY]: {
      token: "0x83236b1a94AEC9f1Fd3Ad35ddf838139EA4b9729",
      distributor: "0xc15BAd8De67c6b2294C8ec27694Fd12B734cE4C5",
    },
  },
} as const;
