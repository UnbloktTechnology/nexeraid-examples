import { useQuery } from "@tanstack/react-query";

import { AptosSignature } from "@nexeraid/identity-schemas";

import type { Aptos } from "./walletTypes";

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

const openAptosWallet = () => {
  if ("aptos" in window) {
    return window.aptos;
  } else {
    // @ts-expect-error: this window is not typed
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    window.open("https://petra.app/", `_blank`);
  }
};

export const getWallet = async () => {
  const wallet = openAptosWallet();
  if (wallet === undefined) {
    console.log("could not fetch aptos wallet");
    throw new Error("could not fetch aptos wallet");
  }
  try {
    const response = await wallet.connect();
    return { wallet, ...response };
  } catch (error) {
    console.log({ code: 4001, message: "User rejected the request." });
  }
  return { wallet, address: undefined, publicKey: undefined };
};
export const useAptosWallet = () => {
  const { data, refetch } = useQuery({
    queryKey: ["aptosWallet"],
    queryFn: getWallet,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    enabled: false,
  });
  return { wallet: data, connectAptos: refetch };
};
