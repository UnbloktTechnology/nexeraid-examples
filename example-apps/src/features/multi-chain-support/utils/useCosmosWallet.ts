import type { Keplr } from "@keplr-wallet/types";
import { useQuery } from "@tanstack/react-query";

import { CosmosSignature } from "@nexeraprotocol/identity-schemas";

export const COSMOS_CHAIN_ID = "cosmoshub-4";

export const signWithCosmos = async (
  message: string,
  wallet: Keplr | undefined,
) => {
  // Ensure that Keplr is installed and available
  if (!wallet) {
    throw new Error("Wallet not connected");
  }
  const offlineSigner = wallet.getOfflineSigner(COSMOS_CHAIN_ID);

  const accounts = await offlineSigner.getAccounts();
  const cosmosAddress = accounts[0]?.address;
  if (!cosmosAddress) {
    throw new Error("Wallet not connected - cosmosAddress missing");
  }

  // Sign the message using Keplr
  const signed = await wallet.signArbitrary(
    COSMOS_CHAIN_ID,
    cosmosAddress,
    message, // Make sure SIGN_MSG is defined somewhere in your code
  );
  // Decode base64 signature to bytes
  const signatureBytes = Uint8Array.from(atob(signed.signature), (c) =>
    c.charCodeAt(0),
  );

  // Convert bytes to hexadecimal string
  const signatureHex = Array.prototype.map
    .call(signatureBytes, (x: number) => ("00" + x.toString(16)).slice(-2))
    .join("");

  // Return the signature
  return CosmosSignature.parse(signatureHex);
};

export const useCosmosWallet = () => {
  const { data, refetch } = useQuery({
    queryKey: ["cosmosWallet"],
    queryFn: async () => {
      if (!window.keplr) {
        throw new Error("Keplr extension not installed or not available");
      }
      await window.keplr.enable(COSMOS_CHAIN_ID);

      const offlineSigner = window.keplr.getOfflineSigner(COSMOS_CHAIN_ID);

      const accounts = await offlineSigner.getAccounts();
      const cosmosAddress = accounts[0]?.address;
      if (!cosmosAddress) {
        throw new Error("Wallet not connected - cosmosAddress missing");
      }

      return { wallet: window.keplr, address: cosmosAddress };
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
    connectCosmos: refetch,
  };
};
