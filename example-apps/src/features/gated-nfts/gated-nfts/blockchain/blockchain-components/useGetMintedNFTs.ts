import { useContractEvent, useContractRead, useContractReads } from "wagmi";

import {
  ExampleGatedNFTMinterABI,
  ExampleNFTMinterABI,
} from "@nexeraprotocol/nexera-id-contracts-sdk/abis";
import {
  ExampleGatedNFTMinterAddress_mumbai_dev,
  ExampleNFTMinterAddress_mumbai_dev,
} from "@nexeraprotocol/nexera-id-contracts-sdk/addresses";
import type { Address } from "@nexeraprotocol/nexera-id-schemas";
import { useEffect, useState } from "react";
import type { MintedNFT } from "./DisplayMintedNFTs";

export const useGetGatedMintedNFTs = () => {
  // Use this hook to only update nfts after wagmi hook has loaded and nfts are defined
  const [mintedGatedNFTs, setMintedNFTs] = useState<MintedNFT[]>([]);
  const exampleGatedContract = {
    address: ExampleGatedNFTMinterAddress_mumbai_dev,
    abi: ExampleGatedNFTMinterABI,
  };
  // fetch tokenId
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

  // for each tokenId, fetch owner
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

  // only update nfts after wagmi hook has loaded and nfts are defined
  useEffect(() => {
    if (!(isLoadingLastTokenId || isLoading) && data) {
      setMintedNFTs(
        data?.map((ownerResponse, i) => {
          return {
            tokenId: i + 1,
            owner: (ownerResponse.result as Address) || undefined,
          };
        }),
      );
    }
  }, [data, isLoadingLastTokenId, isLoading]);

  // Listen for new Transfer events on the Example NFT
  const [newNFTs, setNewNFTs] = useState<MintedNFT[]>([]);
  function addNewNFT(_newNFT: MintedNFT) {
    setNewNFTs((currentNFTs) => [...currentNFTs, _newNFT]);
  }
  useContractEvent({
    address: ExampleGatedNFTMinterAddress_mumbai_dev,
    abi: ExampleGatedNFTMinterABI,
    eventName: "Transfer",

    listener(logs) {
      logs[0]?.args.to &&
        logs[0]?.args.tokenId &&
        logs[0].blockNumber &&
        addNewNFT({
          owner: logs[0]?.args.to,
          tokenId: Number(logs[0]?.args.tokenId),
          blockNumber: Number(logs[0].blockNumber),
          time: Date.now(),
        });
    },
  });

  return {
    newNFTs,
    nfts: mintedGatedNFTs,
    isError: isErrorLastTokenId || isError,
    isLoading: isLoading || isLoadingLastTokenId,
  };
};

export const useGetNonGatedMintedNFTs = () => {
  // Use this hook to only update nfts after wagmi hook has loaded and nfts are defined
  const [mintedGatedNFTs, setMintedNFTs] = useState<MintedNFT[]>([]);
  const exampleGatedContract = {
    address: ExampleNFTMinterAddress_mumbai_dev,
    abi: ExampleNFTMinterABI,
  };
  // fetch tokenId
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

  // for each tokenId, fetch owner
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

  // only update nfts after wagmi hook has loaded and nfts are defined
  useEffect(() => {
    if (!(isLoadingLastTokenId || isLoading) && data) {
      setMintedNFTs(
        data?.map((ownerResponse, i) => {
          return {
            tokenId: i + 1,
            owner: (ownerResponse.result as Address) || undefined,
          };
        }),
      );
    }
  }, [data, isLoadingLastTokenId, isLoading]);

  // Listen for new Transfer events on the Example NFT
  const [newNFTs, setNewNFTs] = useState<MintedNFT[]>([]);
  function addNewNFT(_newNFT: MintedNFT) {
    setNewNFTs((currentNFTs) => [...currentNFTs, _newNFT]);
  }
  useContractEvent({
    address: ExampleNFTMinterAddress_mumbai_dev,
    abi: ExampleNFTMinterABI,
    eventName: "Transfer",

    listener(logs) {
      logs[0]?.args.to &&
        logs[0]?.args.tokenId &&
        logs[0].blockNumber &&
        addNewNFT({
          owner: logs[0]?.args.to,
          tokenId: Number(logs[0]?.args.tokenId),
          blockNumber: Number(logs[0].blockNumber),
          time: Date.now(),
        });
    },
  });

  return {
    newNFTs,
    nfts: mintedGatedNFTs,
    isError: isErrorLastTokenId || isError,
    isLoading: isLoading || isLoadingLastTokenId,
  };
};
