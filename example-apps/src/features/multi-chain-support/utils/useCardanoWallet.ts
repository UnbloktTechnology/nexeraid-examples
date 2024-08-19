import { useQuery } from "@tanstack/react-query";

import { CardanoSignature } from "@nexeraid/identity-schemas";

export const formatCardanoAddress = async (rawByteString: string) => {
  // Convert hexadecimal string to Uint8Array
  const bytes = new Uint8Array(
    rawByteString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
  );
  const { Address } = await import("@emurgo/cardano-serialization-lib-browser");

  // Create Address object
  const address = Address.from_bytes(bytes);

  // Convert Address to Bech32 string
  const bech32Address = address.to_bech32();
  return bech32Address;
};

export type Cardano = Record<
  string,
  {
    name: string;
    icon: string;
    version: string;
    api?: WalletApi;
    enable: () => Promise<WalletApi>;
    isEnabled: () => Promise<boolean>;
  }
>;

export interface WalletApi {
  getNetworkId: () => Promise<number>;
  getUtxos: () => Promise<string[] | undefined>;
  getBalance: () => Promise<string>;
  getUsedAddresses: () => Promise<string[]>;
  getUnusedAddresses: () => Promise<string[]>;
  getChangeAddress: () => Promise<string>;
  getRewardAddresses: () => Promise<string[]>;
  signTx: (tx: string, partialSign: boolean) => Promise<string>;
  signData: (
    address: string,
    payload: string,
  ) => Promise<{ signature: string; key: string }>;
  submitTx: (tx: string) => Promise<string>;
  getCollateral: () => Promise<string[]>;
}

export const signWithCardano = async (
  message: string,
  wallet: WalletApi | undefined,
) => {
  if (!wallet) {
    throw new Error("signWithCardano called before wallet was connected");
  }
  const usedAddresses = await wallet.getUsedAddresses();

  const userAddress = usedAddresses[0];
  if (!userAddress) {
    throw new Error("No user connected in wallet");
  }
  const hexMessage = Buffer.from(message).toString("hex");
  // Note: this only works with this raw address and not the formatted version
  const { signature } = await wallet.signData(userAddress, hexMessage);
  return CardanoSignature.parse(signature);
};

const isBrowser = () => typeof window !== "undefined";

export const getCardano = (): Cardano | undefined => {
  const cardano = isBrowser() ? window.cardano : undefined;
  return cardano;
};

export const useCardanoWallet = () => {
  const { data, refetch } = useQuery({
    queryKey: ["cardanoWallet"],
    queryFn: async () => {
      const cardano = getCardano()!;
      const api = await cardano.nami!.enable();
      const usedAddresses = await api.getUsedAddresses();
      const userAddress = usedAddresses[0];
      const formattedAddress =
        userAddress && (await formatCardanoAddress(userAddress));

      if (!formattedAddress) {
        throw new Error("No user connected in wallet");
      }
      return { wallet: api, address: formattedAddress };
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
    connectCardano: refetch,
  };
};
