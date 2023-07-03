/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type AppType } from "next/app";
import "@/styles/globals.css";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { arbitrumGoerli, avalancheFuji, polygonMumbai } from "viem/chains";
import dynamic from "next/dynamic";
import { api } from "@/utils/api";

// @typescript-eslint/no-unsafe-call
const { chains, publicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    polygonMumbai,
    arbitrumGoerli,
    avalancheFuji,
  ],
  [publicProvider()]
);

// @typescript-eslint/no-unsafe-call
const { connectors } = getDefaultWallets({
  appName: "NexeraID DEFi Example app",
  projectId: "5d874ef9e44150c54831f6ba7e6d6228",

  chains,
});

// @typescript-eslint/no-unsafe-call
const wagmiConfig = createConfig({
  autoConnect: true,

  connectors,

  publicClient,
});

const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />

          <ReactQueryDevtools initialIsOpen={false} />
          <ToastContainer />
        </QueryClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default dynamic(() => Promise.resolve(api.withTRPC(MyApp)), {
  ssr: false,
});
