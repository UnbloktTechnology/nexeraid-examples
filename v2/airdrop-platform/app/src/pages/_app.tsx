import type { AppType } from "next/app";
import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import { WagmiProvider } from "wagmi";
import { nexeraIdConfig } from "@/nexeraIdConfig";
import { wagmiConfig } from "@/wagmiConfig";
import { NexeraIdProvider } from "@nexeraid/react-sdk";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <NexeraIdProvider config={nexeraIdConfig}>
            <Component {...pageProps} />
            <ReactQueryDevtools initialIsOpen={false} />
            <ToastContainer />
          </NexeraIdProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
};

export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
});
