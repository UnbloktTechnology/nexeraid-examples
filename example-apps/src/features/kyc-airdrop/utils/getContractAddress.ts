import type { EvmChainId } from "@nexeraprotocol/identity-schemas";
import { NEXERA_EVM_CHAINS } from "@nexeraprotocol/identity-schemas";

const exampleTokenAddressSepolia =
  "0x1dE19c9Da1D6ef4D4Db6Dc0Fe7cFB508f1505003" as const;
const exampleTokenAddressAmoy =
  "0x187814D67815a1b07781D8084bEfC60C5BF76786" as const;
const distributorAddressSepolia =
  "0x93bdAB0468d0Dbb79F398A872fCa6F883B6945AD" as const;
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
