import { NetworkType, SigningType } from "@airgap/beacon-types";
import { TezosSignature } from "@nexeraid/identity-schemas";
import { useQuery } from "@tanstack/react-query";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { RpcClient } from "@taquito/rpc";
import { TezosToolkit } from "@taquito/taquito";
import { stringToBytes } from "@taquito/utils";

const RPC_ENDPOINT = "https://rpc.ghostnet.teztnets.com/";

/**
 * @deprecated: use signWithTezosAndGetKey instead
 */
export const signWithTezos = async (
  message: string,
  wallet: BeaconWallet | undefined,
) => {
  const { signature } = await signWithTezosAndGetKey(message, wallet);
  return signature;
};

export const signWithTezosAndGetKey = async (
  message: string,
  wallet: BeaconWallet | undefined,
) => {
  if (!wallet) {
    throw new Error("signWithTezos called before wallet was connected");
  }
  const activeAccount = await wallet.client.getActiveAccount();
  const pubKey = activeAccount?.publicKey ?? "";

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

  const { signature } = await wallet.client.requestSignPayload({
    signingType: SigningType.MICHELINE,
    payload: payloadBytes,
  });

  const fullSignature = signature + pubKey;

  return {
    signature: TezosSignature.parse(fullSignature),
    signerPublicKey: pubKey,
  };
};

let walletCache:
  | {
      wallet: BeaconWallet;
      rpc: RpcClient;
      tezos: TezosToolkit;
    }
  | undefined = undefined;

export const getWallet = async () => {
  if (!walletCache) {
    const tezos = new TezosToolkit(RPC_ENDPOINT);
    // creates a wallet instance
    const wallet = new BeaconWallet({
      name: "Nexera ID Tezos Example",
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
    const rpc = new RpcClient(RPC_ENDPOINT);
    walletCache = { wallet, rpc, tezos };
  }
  const activeAccount = await walletCache.wallet.client.getActiveAccount();
  return { ...walletCache, address: activeAccount?.address };
};

export const useTezosWallet = () => {
  const { data, refetch } = useQuery({
    queryKey: ["tezosWallet"],
    queryFn: getWallet,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    enabled: false,
  });
  return {
    wallet: data?.wallet,
    tezos: data?.tezos,
    address: data?.address,
    connectTezos: refetch,
  };
};
