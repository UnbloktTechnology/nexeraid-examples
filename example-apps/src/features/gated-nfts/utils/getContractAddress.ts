import type { EvmChainId } from "@nexeraprotocol/identity-schemas";
import { NEXERA_EVM_CHAINS } from "@nexeraprotocol/identity-schemas";
import {
  ExampleGatedNFTMinterAddress_amoy_dev,
  ExampleGatedNFTMinterAddress_sepolia_dev,
  ExampleNFTMinterAddress_amoy_dev,
  ExampleNFTMinterAddress_sepolia_dev,
} from "@nexeraid/sig-gating-contracts-sdk/addresses";

export const getGatedContractAddress = (chainId: EvmChainId) => {
  return chainId == NEXERA_EVM_CHAINS.SEPOLIA
    ? ExampleGatedNFTMinterAddress_sepolia_dev
    : chainId == NEXERA_EVM_CHAINS.POLYGON_AMOY
      ? ExampleGatedNFTMinterAddress_amoy_dev
      : ExampleGatedNFTMinterAddress_amoy_dev;
};

export const getNonGatedContractAddress = (chainId: EvmChainId) => {
  return chainId == NEXERA_EVM_CHAINS.SEPOLIA
    ? ExampleNFTMinterAddress_sepolia_dev
    : chainId == NEXERA_EVM_CHAINS.POLYGON_AMOY
      ? ExampleNFTMinterAddress_amoy_dev
      : ExampleGatedNFTMinterAddress_amoy_dev;
};
