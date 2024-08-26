import { useQueryClient } from "@tanstack/react-query";
import { useAccount, useBlockNumber, useChainId, useReadContract } from "wagmi";
import { EvmChainId } from "@nexeraid/identity-schemas";

import { getTokenContractAddress } from "./getContractAddress";
import { useEffect } from "react";
import { tokenABI } from "./abis/tokenABI";

export const useGetTokenBalance = () => {
  const chainId = useChainId();
  const account = useAccount();

  // Use this hook to only update nfts after wagmi hook has loaded and nfts are defined
  const exampleTokenContract = {
    address: getTokenContractAddress(EvmChainId.parse(chainId)),
    abi: tokenABI,
  };
  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  // fetch tokenId
  const {
    data: balance,
    isError,
    isPending,
    queryKey,
  } = useReadContract({
    ...exampleTokenContract,
    functionName: "balanceOf",
    args: [account.address],
  });

  // With wagmi v2, this is how we update contract reads
  useEffect(() => {
    void queryClient.invalidateQueries({ queryKey });
  }, [blockNumber, queryClient, queryKey]);

  return {
    balance: Number(balance) as number | undefined,
    isError: isError,
    isPending: isPending,
  };
};
