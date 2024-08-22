import { useMutation } from "@tanstack/react-query";
import {
  encodeFunctionData,
  type Account,
  type Chain,
  type Client,
  type PublicActions,
  type RpcSchema,
  type Transport,
  type WalletActions,
} from "viem";

import { EvmChainId } from "@nexeraid/identity-schemas";
import { useChainId, useAccount, useSendTransaction } from "wagmi";
import { getDistributorContractAddress } from "./getContractAddress";
import { distributorABI } from "./abis/distributorABI";
import { getUserAllowance, getUserIndex } from "./getUserAllowance";
import userAllowances from "./merkle-tree/complex_example.json";
import { BigNumber } from "ethers";
import BalanceTree from "./merkle-tree/BalanceTree";
import { useSignTransactionData } from "@nexeraid/react-sdk";

const tree = new BalanceTree(
  Object.entries(userAllowances).map((ent) => {
    return {
      account: ent[0],
      amount: BigNumber.from(ent[1]),
    };
  }),
);

export type WalletClientExtended = Client<
  Transport,
  Chain,
  Account,
  RpcSchema,
  PublicActions & WalletActions<Chain, Account>
>;
export const useClaimToken = () => {
  const chainId = useChainId();
  const account = useAccount();
  const sendTx = useSendTransaction();
  const signTransactionData = useSignTransactionData();

  return useMutation({
    mutationFn: async () => {
      try {
        if (!account.address) {
          throw new Error("No account in wallet Client - address");
        }

        // build inputs
        const amount = getUserAllowance(account.address);
        const index = getUserIndex(account.address);
        const proof = tree.getProof(
          index,
          account.address,
          BigNumber.from(amount),
        );
        const signatureResponse = await signTransactionData({
          namespace: "eip155",
          userAddress: account.address,
          contractAbi: Array.from(distributorABI),
          contractAddress: getDistributorContractAddress(
            EvmChainId.parse(chainId),
          ),
          functionName: "claim",
          args: [index, account.address, amount, proof],
          chainId: EvmChainId.parse(chainId),
        });

        // If user is not authorized return empty
        if (!signatureResponse.isAuthorized) {
          return {
            txHash: "0x",
            signatureResponse,
          };
        }

        const blockExpiration = signatureResponse.blockExpiration;

        const payload = signatureResponse.payload;

        // Create function call data
        const unsignedTx = encodeFunctionData({
          abi: Array.from(distributorABI),
          functionName: "claim",
          args: [index, account.address, amount, proof],
        });

        // Complete data with payload from UI (require blockExpiration+ signature)
        const txData = (unsignedTx + payload) as `0x${string}`;

        // Claim with signature
        const result = await sendTx.sendTransactionAsync({
          to: getDistributorContractAddress(EvmChainId.parse(chainId)),
          data: txData,
        });

        return {
          txHash: result,
          signatureResponse: {
            isAuthorized: signatureResponse.isAuthorized,
            payload,
            blockExpiration,
          },
        };
      } catch (e) {
        console.log(
          "error during getTxAuthDataSignature",
          (e as Error).toString(),
        );
        return {
          signatureResponse: {
            isAuthorized: false,
          },
          error: (e as Error).toString().substring(0, 108),
        };
      }
    },
  });
};
