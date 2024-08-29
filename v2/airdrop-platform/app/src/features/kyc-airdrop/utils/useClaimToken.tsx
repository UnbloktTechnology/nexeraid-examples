import { useMutation } from "@tanstack/react-query";
import {
  encodeFunctionData,
  type Account,
  type Address,
  type Chain,
  type Client,
  type PublicActions,
  type RpcSchema,
  type Transport,
  type WalletActions,
} from "viem";
import { EvmChainId } from "@nexeraid/identity-schemas";
import { useChainId, useAccount, useSendTransaction } from "wagmi";
import userAllowances from "./merkle-tree/complex_example.json";
import { createBalanceTree } from "@nexeraid/merkle-tree-js";
import { useGetTxAuthDataSignature } from "@nexeraid/react-sdk";
import { getDistributorContractAddress } from "@/kyc-airdrop/config/EXAMPLE_AIRDROP_CONTRACT_ADDRESSES";
import { MerkleDistributorAbi } from "@/kyc-airdrop/abis/MerkleDistributorAbi";
import {
  getUserAirdropAmount,
  getUserIndex,
} from "@/kyc-airdrop/airdropActions";

const tree = createBalanceTree({
  balances: Object.entries(userAllowances).map((ent) => {
    return {
      account: ent[0] as Address,
      amount: BigInt(ent[1]),
    };
  }),
});

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
  const getTxAuthDataSignature = useGetTxAuthDataSignature();

  return useMutation({
    mutationFn: async () => {
      try {
        if (!account.address) {
          throw new Error("No account in wallet Client - address");
        }

        // build inputs
        const amount = getUserAirdropAmount(account.address);
        if (amount instanceof Error) {
          throw amount;
        }

        const index = getUserIndex(account.address);
        if (index instanceof Error) {
          throw index;
        }

        const proof = tree.getProof({
          account: account.address,
          index: BigInt(index),
          amount: BigInt(amount ?? 0),
        });
        const distributorAddress = getDistributorContractAddress(chainId);
        const signatureResponse = await getTxAuthDataSignature({
          namespace: "eip155",
          userAddress: account.address,
          contractAbi: Array.from(MerkleDistributorAbi),
          contractAddress: distributorAddress,
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
          abi: Array.from(MerkleDistributorAbi),
          functionName: "claim",
          args: [BigInt(index), account.address, BigInt(amount), proof],
        });

        // Complete data with payload from UI (require blockExpiration+ signature)
        const txData = (unsignedTx + payload) as `0x${string}`;

        // Claim with signature
        const result = await sendTx.sendTransactionAsync({
          to: distributorAddress,
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
