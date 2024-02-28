import { useContractRead, useContractReads } from "wagmi";

import {
  ExampleGatedNFTMinterABI,
  ExampleNFTMinterABI,
} from "@nexeraprotocol/nexera-id-contracts-sdk/abis";
import {
  ExampleGatedNFTMinterAddress_mumbai_dev,
  ExampleNFTMinterAddress_mumbai_dev,
} from "@nexeraprotocol/nexera-id-contracts-sdk/addresses";
import type { Address } from "@nexeraprotocol/nexera-id-schemas";

export const useGetGatedMintedNFTs = () => {
  const exampleGatedContract = {
    address: ExampleGatedNFTMinterAddress_mumbai_dev,
    abi: ExampleGatedNFTMinterABI,
  };
  const {
    data: lastTokenId,
    isError: isErrorLastTokenId,
    isLoading: isLoadingLastTokenId,
  } = useContractRead({
    ...exampleGatedContract,
    functionName: "getLastTokenId",
    watch: true,
  });
  const numberOfNFTs = lastTokenId ? Number(lastTokenId) : 0;

  const { data, isError, isLoading } = useContractReads({
    contracts: Array.from({ length: numberOfNFTs }, (_, i) => {
      return {
        ...exampleGatedContract,
        functionName: "ownerOf",
        args: [i + 1], // Assuming you want to start from 1
        watch: true,
      };
    }),
    enabled: lastTokenId !== undefined,
  });

  return {
    nfts: data?.map((ownerResponse, i) => {
      return {
        tokenId: i + 1,
        owner: (ownerResponse.result as Address) || undefined,
      };
    }),
    isError: isErrorLastTokenId || isError,
    isLoading: isLoading || isLoadingLastTokenId,
  };
};

export const useGetNonGatedMintedNFTs = () => {
  const exampleGatedContract = {
    address: ExampleNFTMinterAddress_mumbai_dev,
    abi: ExampleNFTMinterABI,
  };
  const {
    data: lastTokenId,
    isError: isErrorLastTokenId,
    isLoading: isLoadingLastTokenId,
  } = useContractRead({
    ...exampleGatedContract,
    functionName: "getLastTokenId",
    watch: true,
  });
  const numberOfNFTs = lastTokenId ? Number(lastTokenId) : 0;

  const { data, isError, isLoading } = useContractReads({
    contracts: Array.from({ length: numberOfNFTs }, (_, i) => {
      return {
        ...exampleGatedContract,
        functionName: "ownerOf",
        args: [i + 1], // Assuming you want to start from 1
        watch: true,
      };
    }),
    enabled: lastTokenId !== undefined,
  });

  return {
    nfts: data?.map((ownerResponse, i) => {
      return {
        tokenId: i + 1,
        owner: (ownerResponse.result as Address) || undefined,
      };
    }),
    isError: isErrorLastTokenId || isError,
    isLoading: isLoading || isLoadingLastTokenId,
  };
};
