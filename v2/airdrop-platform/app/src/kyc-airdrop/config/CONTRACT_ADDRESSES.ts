import type { EvmChainId } from "@nexeraid/identity-schemas";
import { NEXERA_EVM_CHAINS, type Environment } from "@nexeraid/identity-schemas";
import type { Address } from "viem";

// Contract addresses for different environments and chains
export const CONTRACT_ADDRESSES: {
  [key in Environment]: Partial<{
    [key in EvmChainId]: { token: Address; distributor: Address }
  }>
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
      token: "0xDB823f5Ad993FD794Fb5Fea1AFc25e1717C849Cd",
      distributor: "0x000Ce3800FD935aCF93FDF9fA3A0924DA2D13d5B",
    },
  },
  cicd: {},
  "test-dev-1": {},
  "test-dev-2": {},
  dev: {},
  stage: {}
} as const;