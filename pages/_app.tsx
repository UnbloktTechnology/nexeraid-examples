// src/pages/_app.tsx
import type { AppType } from "next/app";

import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { polygonMumbai } from "wagmi/chains";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [
    alchemyProvider({ apiKey: "l17F_fBBtM6Tn1RNN_lXaXMc2Czt0tlA" }),
    publicProvider(),
  ]
);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </WagmiConfig>
  );
};

export default MyApp;
