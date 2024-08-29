// TODO ExtendedTxAuthInput shold be exposed in react and web sdks
import type { Address } from "@nexeraid/identity-schemas";
import { CUSTOMERS_BALANCE_MAP } from "./config/CUSTOMERS_BALANCE_MAP";
import { parseBalanceMap } from "@nexeraid/merkle-tree-js";
import { encodeFunctionData } from "viem";
import { DISTRIBUTOR_ABI } from "./config/DISTRIBUTOR_ABI";
import { EXAMPLE_AIRDROP_CONTRACT_ADDRESSES } from "./config/EXAMPLE_AIRDROP_CONTRACT_ADDRESSES";
import { EvmChainId } from "@nexeraid/identity-schemas";
import { env } from "@/env.mjs";
import { getTxAuthDataSignature } from "@nexeraid/react-sdk";
import { nexeraIdConfig } from "@/nexeraIdConfig";
import { sendTransaction } from "@wagmi/core";
import { wagmiConfig } from "@/wagmiConfig";

export const getUserAirdropAmount = (userAddress: Address) => {
  const balance = CUSTOMERS_BALANCE_MAP.find(
    (balance) => balance.address === userAddress,
  );
  return balance ? parseInt(balance.earnings, 10) : Error("User not found");
};

export const getUserIndex = (userAddress: Address) => {
  const balanceMap = parseBalanceMap({ balances: CUSTOMERS_BALANCE_MAP });
  return balanceMap.claims[userAddress]?.index ?? Error("User not found");
};

export const getUserProof = (userAddress: Address) => {
  const balanceMap = parseBalanceMap({ balances: CUSTOMERS_BALANCE_MAP });
  return balanceMap.claims[userAddress]?.proof ?? Error("User not found");
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

  const distributorAddress =
    EXAMPLE_AIRDROP_CONTRACT_ADDRESSES[env.NEXT_PUBLIC_ENVIRONMENT][
      EvmChainId.parse(chainId)
    ]?.distributor;
  if (!distributorAddress) {
    throw new Error("Distributor address not found");
  }

  const signatureResponse = await getTxAuthDataSignature(nexeraIdConfig, {
    namespace: "eip155",
    userAddress: userAddress,
    contractAbi: Array.from(DISTRIBUTOR_ABI),
    contractAddress: distributorAddress,
    functionName: "claim",
    args: [index, userAddress, amount, proof],
    chainId: chainId,
  });

  if (!signatureResponse.isAuthorized) throw new Error("User not authorized");

  const unsignedTx = encodeFunctionData({
    abi: Array.from(DISTRIBUTOR_ABI),
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
