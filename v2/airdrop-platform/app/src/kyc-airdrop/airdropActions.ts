// TODO ExtendedTxAuthInput shold be exposed in react and web sdks
import type { Address } from "@nexeraid/identity-schemas";
import { CUSTOMERS_BALANCE_MAP } from "./config/CUSTOMERS_BALANCE_MAP";
import { parseBalanceMap } from "@nexeraid/merkle-tree-js";
import { encodeFunctionData, type Hex } from "viem";
import { MerkleDistributorAbi } from "./abis/MerkleDistributorAbi";
import { getDistributorContractAddress } from "./config/EXAMPLE_AIRDROP_CONTRACT_ADDRESSES";
import type { EvmChainId } from "@nexeraid/identity-schemas";
import { getTxAuthDataSignature } from "@nexeraid/react-sdk";
import { nexeraIdConfig } from "@/nexeraIdConfig";
import { sendTransaction } from "@wagmi/core";
import { wagmiConfig } from "@/wagmiConfig";

const balanceMap = parseBalanceMap({ balances: CUSTOMERS_BALANCE_MAP });

export const getUserAirdropAmount = (userAddress: Address): bigint | Error => {
  const amount = balanceMap.claims[userAddress]?.amount;
  return amount ? BigInt(amount) : Error("User not found");
};

export const isUserQualified = (userAddress: Address): boolean => {
  return !!balanceMap.claims[userAddress];
};

export const getUserIndex = (userAddress: Address): bigint | Error => {
  const index = balanceMap.claims[userAddress]?.index;
  return index ? BigInt(index) : Error("User not found");
};

export const getUserProof = (userAddress: Address): Hex[] | Error => {
  const proof = balanceMap.claims[userAddress]?.proof;
  return proof ? (proof as Hex[]) : Error("User not found");
};

export const claimToken = async (props: {
  userAddress: Address;
  chainId: EvmChainId;
}) => {
  const { userAddress, chainId } = props;

  const amount = getUserAirdropAmount(userAddress);
  const index = getUserIndex(userAddress);
  const proof = getUserProof(userAddress);

  if (
    amount instanceof Error ||
    index instanceof Error ||
    proof instanceof Error
  ) {
    throw new Error("User not found");
  }

  const distributorAddress = getDistributorContractAddress(chainId);

  const signatureResponse = await getTxAuthDataSignature(nexeraIdConfig, {
    namespace: "eip155",
    userAddress: userAddress,
    contractAbi: Array.from(MerkleDistributorAbi),
    contractAddress: distributorAddress,
    functionName: "claim",
    args: [index, userAddress, amount, proof],
    chainId: chainId,
  });

  if (!signatureResponse.isAuthorized) throw new Error("User not authorized");

  const unsignedTx = encodeFunctionData({
    abi: Array.from(MerkleDistributorAbi),
    functionName: "claim",
    args: [index, userAddress, amount, proof],
  });

  const txData = (unsignedTx + signatureResponse.payload) as `0x${string}`;
  const txHash = await sendTransaction(wagmiConfig, {
    to: distributorAddress,
    data: txData,
  });

  return {
    txHash,
    distributorAddress,
    txData,
    signatureResponse: {
      isAuthorized: signatureResponse.isAuthorized,
      payload: signatureResponse.payload,
      blockExpiration: signatureResponse.blockExpiration,
    },
  };
};
