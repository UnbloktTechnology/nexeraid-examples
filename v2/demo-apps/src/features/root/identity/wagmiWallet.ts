import { EvmChainId } from "@nexeraid/identity-schemas";
import { getAccount, getChainId, signMessage } from "wagmi/actions";
import type { Web3Wallet } from "@nexeraid/react-sdk";
import type { Config } from "wagmi";

// TODO: use "@nexeraid/react-sdk-wallet-rainbowkit" directly
export const createWagmiWalletConfig = (wagmiConfig: Config): Web3Wallet => ({
  namespace: "eip155",
  isConnected: () => {
    const { isConnected } = getAccount(wagmiConfig);
    return isConnected;
  },
  sign: async (data: { message: string }) => {
    const { address } = getAccount(wagmiConfig);
    if (!address) throw new Error("Missing address");
    const signature = await signMessage(wagmiConfig, {
      message: data.message,
    });
    return {
      signature,
      signerPublicKey: address,
      message: data.message,
      signedMessage: data.message,
    };
  },
  getAddress: () => {
    const { address } = getAccount(wagmiConfig);
    return address;
  },
  getBlockchainId: () => {
    const number = getChainId(wagmiConfig);
    return EvmChainId.parse(`${number}`);
  },
});
