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

import { ExampleGatedNFTMinterABI } from "@nexeraprotocol/nexera-id-contracts-sdk/abis";
import {
  ExampleGatedNFTMinterAddress_mumbai_dev,
  ExampleGatedNFTMinterAddress_sepolia_dev,
} from "@nexeraprotocol/nexera-id-contracts-sdk/addresses";
import type { Address, Signature } from "@nexeraprotocol/nexera-id-schemas";
import { IDENTITY_CLIENT } from "../../identity/IdentityClient";

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
  return useMutation({
    mutationFn: async (input: {
      client: WalletClientExtended;
      write: (config: { args: [Address, bigint, Signature] }) => void;
    }) => {
      if (!IDENTITY_CLIENT.init) {
        console.log("IDENTITY_CLIENT is not initizalied");
        return { signatureResponse: { isAuthorized: false } };
      }
      try {
        const [userAddress] = await input.client.getAddresses();
        if (!userAddress) {
          throw new Error("No account in wallet Client - address");
        }

        // get chain ID from client
        const chainId = await input.client.getChainId();

        const txAuthInput = {
          contractAbi: ExampleGatedNFTMinterABI,
          contractAddress:
            chainId == 11155111
              ? ExampleGatedNFTMinterAddress_sepolia_dev
              : ExampleGatedNFTMinterAddress_mumbai_dev,
          functionName: "mintNFTGated",
          args: [userAddress],
        };
        const signatureResponse = await IDENTITY_CLIENT.getTxAuthSignature({
          txAuthInput,
          chainId,
        });

        if (
          signatureResponse.isAuthorized &&
          signatureResponse.blockExpiration &&
          signatureResponse.signature
        ) {
          // Mint Gated Nft with signature
          input.write({
            args: [
              userAddress,
              BigInt(signatureResponse.blockExpiration),
              signatureResponse.signature,
            ],
          });

          return {
            signatureResponse,
          };
        } else {
          try {
            // Mint Gated Nft with signature
            input.write({
              args: [
                userAddress,
                BigInt(Number(await input.client.getBlockNumber()) + 10),
                WRONG_SIGNATURE,
              ],
            });

            return {
              signatureResponse,
            };
          } catch (e) {
            return {
              signatureResponse: {
                isAuthorized: false,
                signature: WRONG_SIGNATURE,
              },
              error: (e as Error).toString().substring(0, 108),
            };
          }
        }
      } catch (e) {
        console.log("error during getTxAuthDataSignature", e);
        return { signatureResponse: { isAuthorized: false } };
      }
    },
  });
};
