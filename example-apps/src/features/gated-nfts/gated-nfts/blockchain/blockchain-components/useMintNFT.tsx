import { useMutation } from "@tanstack/react-query";
import type {
  Account,
  Chain,
  Client,
  PublicActions,
  RpcSchema,
  Transport,
  WalletActions,
} from "viem";
import { sepolia } from "viem/chains";

import { ExampleGatedNFTMinterABI } from "@nexeraprotocol/nexera-id-sig-gating-contracts-sdk/abis";
import {
  ExampleGatedNFTMinterAddress_mumbai_dev,
  ExampleGatedNFTMinterAddress_sepolia_dev,
} from "@nexeraprotocol/nexera-id-sig-gating-contracts-sdk/addresses";
import { ChainId, type Signature } from "@nexeraprotocol/identity-schemas";
import { IDENTITY_CLIENT } from "../../identity/IdentityClient";
import {
  useChainId,
  useAccount,
  useBlockNumber,
  useContractWrite,
} from "wagmi";

const WRONG_SIGNATURE: Signature =
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

  const mintNFTGatedFromSDK = useContractWrite({
    address:
      chainId == sepolia.id
        ? ExampleGatedNFTMinterAddress_sepolia_dev
        : ExampleGatedNFTMinterAddress_mumbai_dev,
    abi: ExampleGatedNFTMinterABI,
    functionName: "mintNFTGated",
  });

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
          contractAddress:
            chainId == sepolia.id
              ? ExampleGatedNFTMinterAddress_sepolia_dev
              : ExampleGatedNFTMinterAddress_mumbai_dev,
          functionName: "mintNFTGated",
          args: [account.address],
          chainId: ChainId.parse(chainId),
        };

        const signatureResponse =
          await IDENTITY_CLIENT.getTxAuthSignature(txAuthInput);

        // If user is not authorized, use wrong signature and dummy blockExpiratioin
        const blockExpiration =
          signatureResponse.blockExpiration ??
          (blockNumber.data ? Number(blockNumber.data) + 10 : 0);
        const signature = signatureResponse.signature ?? WRONG_SIGNATURE;

        // Mint Gated Nft with signature
        const result = await mintNFTGatedFromSDK.writeAsync({
          args: [account.address, BigInt(blockExpiration), signature],
        });

        return {
          txHash: result.hash,
          signatureResponse: {
            isAuthorized: signatureResponse.isAuthorized,
            signature,
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
