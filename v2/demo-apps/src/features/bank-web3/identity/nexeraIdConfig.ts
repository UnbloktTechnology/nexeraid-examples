import { createConfig, createWeb3AuthAdapter } from "@nexeraid/react-sdk";
import { wagmiConfig } from "./wagmiConfig";
import { EvmChainId } from "@nexeraid/identity-schemas";
import { getAccount, getChainId, signMessage } from "wagmi/actions";
import "@/features/root/configureReactDemoEnv";

export const nexeraIdConfig = createConfig({
	authAdapter: createWeb3AuthAdapter({
		// TODO: use "@nexeraid/react-sdk-wallet-rainbowkit" directly
		wallet: {
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
		},
		generateChallenge: async (params) => {
			const challenge = await fetch("/api/bank-web3/challenge", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(params),
			});

			return challenge.json();
		},
	}),
});
