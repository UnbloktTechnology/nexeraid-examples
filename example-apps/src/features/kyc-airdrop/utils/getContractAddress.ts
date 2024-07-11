import type { EvmChainId } from "@nexeraprotocol/identity-schemas";
import { NEXERA_EVM_CHAINS } from "@nexeraprotocol/identity-schemas";

// For Prod
// const exampleTokenAddressSepolia =
//   "0x1dE19c9Da1D6ef4D4Db6Dc0Fe7cFB508f1505003" as const;
// For lcoal testing
const exampleTokenAddressSepolia =
  "0x7F6DCe06824aE8b0F0A1e4526a61c89187084e8e" as const;
const exampleTokenAddressAmoy =
  "0x187814D67815a1b07781D8084bEfC60C5BF76786" as const;
// For prod
// const distributorAddressSepolia =
//   "0x93bdAB0468d0Dbb79F398A872fCa6F883B6945AD" as const;
// For local
const distributorAddressSepolia =
  "0xA4C8c61C890187c60969D33C4b6357a32205AF09" as const;
const distributorAddressAmoy =
  "0xed8899dC0773B27C42130483d67b6cEaee915923" as const;

export const getTokenContractAddress = (chainId: EvmChainId) => {
  return chainId == NEXERA_EVM_CHAINS.SEPOLIA
    ? exampleTokenAddressSepolia
    : chainId == NEXERA_EVM_CHAINS.POLYGON_AMOY
      ? exampleTokenAddressAmoy
      : exampleTokenAddressAmoy;
};

export const getDistributorContractAddress = (chainId: EvmChainId) => {
  return chainId == NEXERA_EVM_CHAINS.SEPOLIA
    ? distributorAddressSepolia
    : chainId == NEXERA_EVM_CHAINS.POLYGON_AMOY
      ? distributorAddressAmoy
      : distributorAddressAmoy;
};
