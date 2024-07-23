import { useQuery } from "@tanstack/react-query";
import { hash } from "starknet";
import type { AccountInterface, ArraySignatureType } from "starknet";
import { connect } from "starknetkit";

import { StarknetSignature } from "@nexeraprotocol/identity-schemas";

export const signWithStarknet = async (
  message: string,
  account: AccountInterface | undefined,
) => {
  if (!account?.signer) {
    throw new Error("signWithStarknet called before wallet was connected");
  }
  // Message must be hashed in order to be signed by starknet
  const messageHash = hash
    .starknetKeccak(message)
    .toString(16)
    .substring(0, 31);
  const starknetMessage = {
    types: {
      Message: [{ name: "hash", type: "felt" }],
      StarkNetDomain: [{ name: "name", type: "felt" }],
    },
    primaryType: "Message",
    domain: {
      name: "Nexera ID Auth Message",
    },
    message: {
      hash: messageHash,
    },
  };

  // This returns a tuple of two numbers (r,s)
  const signature = (await account.signMessage(
    starknetMessage,
  )) as ArraySignatureType;
  if (!signature[0] || !signature[1]) {
    throw new Error("returned starknet signature is wrong format");
  }
  // It has to be formatted to a single string for the purpose of polygon id derivation
  const formattedSignature =
    "0x" +
    BigInt(signature[0]).toString(16) +
    BigInt(signature[1]).toString(16);

  return StarknetSignature.parse(formattedSignature);
};

export const useStarknetWallet = () => {
  const { data, refetch } = useQuery({
    queryKey: ["starknetWallet"],
    queryFn: async () => {
      const connection = await connect();
      if (connection.wallet === undefined) {
        console.log("could not fetch starknet wallet");
        return;
      }

      return connection.wallet;
    },
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    enabled: false,
  });
  return { wallet: data, connectStarknet: refetch };
};
