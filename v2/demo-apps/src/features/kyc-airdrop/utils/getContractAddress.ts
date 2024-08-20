import type { EvmChainId } from "@nexeraid/identity-schemas";
import { NEXERA_EVM_CHAINS } from "@nexeraid/identity-schemas";

// LOCAL TESTING

// Sepolia
// For local testing
// const exampleTokenAddressSepolia =
//   "0x77DEBBF6Bb3A1F899333ef096217505DDC80433c" as const;

// const distributorAddressSepolia =
//   "0x130089FD95cD9Ff9119d0Df3afdbC6dA1bB87045" as const;

// // Amoy
// const exampleTokenAddressAmoy =
//   "0x20487A4F07B733f6Ed4DCF61AceEC0D647c521eC" as const;
// const distributorAddressAmoy =
//   "0x3703eF2fF956E80a4392Cd53dB1880891075B364" as const;

// PROD

// Sepolia
const exampleTokenAddressSepolia =
  "0x48182d21869b874BabdeCC0851dDA4F89B18a687" as const;

const distributorAddressSepolia =
  "0x96caF7D5DD0304976A070804074E453887BE509c" as const;

// Amoy
const exampleTokenAddressAmoy =
  "0x4Ae0B2Ed56b681ABcfb19A6aAAb921b35b531276" as const;
const distributorAddressAmoy =
  "0x3d95361Fa0d4E83Ac553b359197748baA1226307" as const;

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
