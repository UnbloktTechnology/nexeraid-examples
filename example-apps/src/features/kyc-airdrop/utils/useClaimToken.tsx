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

import { EvmChainId } from "@nexeraprotocol/identity-schemas";
import { IDENTITY_CLIENT } from "../../kyc-widget/IdentityClient";
import { useChainId, useAccount, useSendTransaction } from "wagmi";
import { getDistributorContractAddress } from "./getContractAddress";
import { distributorABI } from "./abis/distributorABI";
import { getUserAllowance, getUserIndex } from "./getUserAllowance";
import userAllowances from "./merkle-tree/complex_example.json";
import { BigNumber } from "ethers";
import BalanceTree from "./merkle-tree/BalanceTree";

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
  const mintNFTGatedFromSDK = useSendTransaction();

  return useMutation({
    mutationFn: async () => {
      if (!IDENTITY_CLIENT.init) {
        console.log("IDENTITY_CLIENT is not initizalied");
        return { signatureResponse: { isAuthorized: false } };
      }
      try {
        if (!account.address) {
          throw new Error("No account in wallet Client - address");
        }

        // build inputs
        const amount = getUserAllowance(account.address);
        const index = getUserIndex(account.address);
        const proof = tree.getProof(0, account.address, BigNumber.from(100));

        const txAuthInput = {
          contractAbi: Array.from(distributorABI),
          contractAddress: getDistributorContractAddress(
            EvmChainId.parse(chainId),
          ),
          functionName: "claim",
          args: [index, account.address, amount, proof],
          chainId: EvmChainId.parse(chainId),
        };

        const signatureResponse =
          await IDENTITY_CLIENT.getTxAuthSignature(txAuthInput);

        // If user is not authorized, use wrong signature and dummy blockExpiratioin
        const blockExpiration = signatureResponse.blockExpiration;

        const payload = signatureResponse.payload;

        // Create function call data
        const unsignedTx = encodeFunctionData({
          abi: distributorABI,
          functionName: "claim",
          args: [index, account.address, amount, proof],
        });

        // Complete data with payload from UI (require blockExpiration+ signature)
        const txData = (unsignedTx + payload) as `0x${string}`;

        // Claim with signature
        const result = await mintNFTGatedFromSDK.sendTransactionAsync({
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
        console.log("error during getTxAuthDataSignature", e);
        return {
          signatureResponse: {
            isAuthorized: false,
            signature: "0x",
          },
          error: (e as Error).toString().substring(0, 108),
        };
      }
    },
  });
};
