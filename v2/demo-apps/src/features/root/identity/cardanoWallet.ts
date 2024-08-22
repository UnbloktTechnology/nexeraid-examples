import {
  getWallet,
  signWithCardanoAndGetKey,
} from "@/features/multi-chain-support/utils/useCardanoWallet";
import { Web3Wallet } from "@nexeraid/react-sdk";

export const cardanoWalletConfig: Web3Wallet = {
  namespace: "cardano",
  getAddress: async () => {
    const { userAddress } = await getWallet();
    return userAddress;
  },
  sign: async ({ message }) => {
    const { wallet } = await getWallet();
    const { signature: rawSign, signerPublicKey } =
      await signWithCardanoAndGetKey(message, wallet);
    return {
      message,
      signature: rawSign,
      signerPublicKey: signerPublicKey,
      signedMessage: message,
    };
  },
  isConnected: async () => {
    const wallet = await getWallet();
    return Boolean(wallet);
  },
};
