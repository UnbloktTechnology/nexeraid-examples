import { useQuery } from "@tanstack/react-query";

import { AptosSignature } from "@nexeraprotocol/identity-schemas";

import type { Aptos } from "./petraWalletTypes";

export const signWithAptos = async (
  message: string,
  wallet: Aptos | undefined,
) => {
  if (!wallet) {
    throw new Error("signWithAptos called before wallet was connected");
  }
  const aptosMessage = {
    address: true,
    application: true,
    chainId: true,
    message,
    nonce: Date.now().toLocaleString(),
  };

  const { signature } = await wallet.signMessage(aptosMessage);

  console.log("signature aptos", signature);
  return AptosSignature.parse(signature);
};

const getAptosWallet = () => {
  if ("aptos" in window) {
    return window.aptos;
  } else {
    // @ts-expect-error: this window is not typed
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    window.open("https://petra.app/", `_blank`);
  }
};

export const useAptosWallet = () => {
  const { data, refetch } = useQuery({
    queryKey: ["aptosWallet"],
    queryFn: async () => {
      const wallet = getAptosWallet();
      if (wallet === undefined) {
        console.log("could not fetch aptos wallet");
        return;
      }
      try {
        const response = await wallet.connect();
        console.log("response", response); // { address: string, address: string }

        const account = await wallet.account();
        console.log("account", account); // { address: string, address: string }
      } catch (error) {
        console.log({ code: 4001, message: "User rejected the request." });
      }
      return wallet;
    },
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    enabled: false,
  });
  return { wallet: data, connectAptos: refetch };
};
