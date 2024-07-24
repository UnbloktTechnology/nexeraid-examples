import { useMutation } from "@tanstack/react-query";
import {
  encodeFunctionData,
  pad,
  toHex,
  type Account,
  type Chain,
  type Client,
  type PublicActions,
  type RpcSchema,
  type Transport,
  type WalletActions,
} from "viem";

import { ExampleGatedNFTMinterABI } from "@nexeraid/sig-gating-contracts-sdk/abis";

import {
  EvmChainId,
  type EIP155Signature,
} from "@unblokttechnology/identity-schemas";
import { IDENTITY_CLIENT } from "../../kyc-widget/IdentityClient";
import {
  useChainId,
  useAccount,
  useBlockNumber,
  useSendTransaction,
} from "wagmi";
import { getGatedContractAddress } from "./getContractAddress";

const WRONG_SIGNATURE: EIP155Signature =
  "0xc6fd40ac16944fd0fef20071149270a2c283c8ae92ffcbb5e61f44348490dc3b65e786637aaa82f46ac3c01941a9875046a2ceb9bad189362014b35f6e74df231b";

export type WalletClientExtended = Client<
  Transport,
  Chain,
  Account,
  RpcSchema,
  PublicActions & WalletActions<Chain, Account>
>;
export const useMintGatedNFTFromSDK = () => {
  const chainId = useChainId();
  const account = useAccount();
  const blockNumber = useBlockNumber();

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

        const txAuthInput = {
          contractAbi: Array.from(ExampleGatedNFTMinterABI),
          contractAddress: getGatedContractAddress(EvmChainId.parse(chainId)),
          functionName: "mintNFTGated",
          args: [account.address],
          chainId: EvmChainId.parse(chainId),
        };

        const signatureResponse =
          await IDENTITY_CLIENT.getTxAuthSignature(txAuthInput);

        // If user is not authorized, use wrong signature and dummy blockExpiratioin
        const blockExpiration =
          signatureResponse.blockExpiration ??
          (blockNumber.data ? Number(blockNumber.data) + 10 : 0);

        const payload =
          signatureResponse.payload ??
          pad(
            // number to hex string number
            toHex(blockExpiration),
            { size: 32 },
          ).slice(2) + WRONG_SIGNATURE.slice(2);

        // Create function call data
        const unsignedTx = encodeFunctionData({
          abi: ExampleGatedNFTMinterABI,
          functionName: "mintNFTGated",
          args: [account.address],
        });

        // Complete data with payload from UI (require blockExpiration+ signature)
        const txData = (unsignedTx + payload) as `0x${string}`;

        // Mint Gated Nft with signature
        const result = await mintNFTGatedFromSDK.sendTransactionAsync({
          to: getGatedContractAddress(EvmChainId.parse(chainId)),
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
            signature: WRONG_SIGNATURE,
          },
          error: (e as Error).toString().substring(0, 108),
        };
      }
    },
  });
};
