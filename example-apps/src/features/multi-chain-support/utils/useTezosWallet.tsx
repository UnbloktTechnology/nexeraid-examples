import { NetworkType, SigningType } from "@airgap/beacon-types";
import { useQuery } from "@tanstack/react-query";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import { stringToBytes } from "@taquito/utils";

import { TezosSignature } from "@nexeraid/identity-schemas";

export const signWithTezos = async (
  message: string,
  wallet: BeaconWallet | undefined,
) => {
  if (!wallet) {
    throw new Error("signWithTezos called before wallet was connected");
  }
  const activeAccount = await wallet.client.getActiveAccount();
  const pubKey = activeAccount?.publicKey;

  // Found this in https://taquito.io/docs/signing/#generating-a-signature-with-beacon-sdk
  const formattedInput: string = [
    "Tezos Signed Message:",
    (window as Window).location.host,
    new Date().toISOString(),
    message,
  ].join(" ");
  const bytes = stringToBytes(formattedInput);
  const bytesLength = (bytes.length / 2).toString(16);
  const addPadding = `00000000${bytesLength}`;
  const paddedBytesLength = addPadding.slice(addPadding.length - 8);
  const payloadBytes = "05" + "01" + paddedBytesLength + bytes;
  console.log("payloadBytes", payloadBytes);

  // 05 prefix is needed for MICHELINE signing
  const { signature } = await wallet.client.requestSignPayload({
    signingType: SigningType.MICHELINE,
    payload: payloadBytes,
  });

  const fullSignature = signature + pubKey;
  console.log("fullSignature", fullSignature);
  return TezosSignature.parse(fullSignature);
};

export const useTezosWallet = () => {
  const { data, refetch } = useQuery({
    queryKey: ["tezosWallet"],
    queryFn: async () => {
      const tezos = new TezosToolkit("https://rpc.ghostnet.teztnets.com");
      // creates a wallet instance
      const wallet = new BeaconWallet({
        name: "SIWx Sample App",
        preferredNetwork: NetworkType.GHOSTNET,
        network: {
          type: NetworkType.GHOSTNET,
        },
      });
      // The Beacon wallet requires an extra step to set up the network to connect to and the permissions:
      await wallet.requestPermissions({
        network: {
          type: NetworkType.GHOSTNET,
        },
      });
      tezos.setWalletProvider(wallet);
      const activeAccount = await wallet?.client.getActiveAccount();
      const address = activeAccount?.address;
      if (!address) {
        throw new Error("Missing pubKey data to authenticate");
      }
      return { wallet, address };
    },
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    enabled: false,
  });
  return {
    wallet: data?.wallet,
    address: data?.address,
    connectTezos: refetch,
  };
};
