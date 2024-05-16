import type { ChainId } from "@nexeraprotocol/identity-schemas";
import { NEXERA_CHAINS } from "@nexeraprotocol/identity-schemas";
import {
  ExampleGatedNFTMinterAddress_amoy_dev,
  ExampleGatedNFTMinterAddress_mumbai_dev,
  ExampleGatedNFTMinterAddress_sepolia_dev,
  ExampleNFTMinterAddress_amoy_dev,
  ExampleNFTMinterAddress_mumbai_dev,
  ExampleNFTMinterAddress_sepolia_dev,
} from "@nexeraprotocol/nexera-id-sig-gating-contracts-sdk/addresses";

export const getGatedContractAddress = (chainId: ChainId) => {
  return chainId == NEXERA_CHAINS.SEPOLIA
    ? ExampleGatedNFTMinterAddress_sepolia_dev
    : chainId == NEXERA_CHAINS.POLYGON_AMOY
      ? ExampleGatedNFTMinterAddress_amoy_dev
      : ExampleGatedNFTMinterAddress_mumbai_dev;
};

export const getNonGatedContractAddress = (chainId: ChainId) => {
  return chainId == NEXERA_CHAINS.SEPOLIA
    ? ExampleNFTMinterAddress_sepolia_dev
    : chainId == NEXERA_CHAINS.POLYGON_AMOY
      ? ExampleNFTMinterAddress_amoy_dev
      : ExampleNFTMinterAddress_mumbai_dev;
};
