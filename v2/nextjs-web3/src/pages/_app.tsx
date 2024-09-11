import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { NexeraIdProvider } from "@nexeraid/react-sdk";
import { config } from "../wagmi";
import { createWagmiWalletAdapter } from "@nexeraid/react-sdk-wallet-wagmi";
import { createWeb3AuthAdapter, createConfig } from "@nexeraid/react-sdk";
import { generateChallenge } from "../nexera-config";

const walletAdapter = createWagmiWalletAdapter(config);
const authAdapter = createWeb3AuthAdapter({
  generateChallenge,
  wallet: walletAdapter,
});
const nexeraConfig = createConfig({ authAdapter });

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
          <NexeraIdProvider config={nexeraConfig}>
            <Component {...pageProps} />
          </NexeraIdProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
