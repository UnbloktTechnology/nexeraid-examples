import { type AppType } from "next/app";
import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import dynamic from "next/dynamic";
import { http, WagmiProvider } from "wagmi";
import { polygonAmoy, polygonMumbai, sepolia } from "wagmi/chains";

const config = getDefaultConfig({
  appName: "NexeraID Example apps",
  projectId: "5d874ef9e44150c54831f6ba7e6d6228",
  chains: [polygonMumbai, polygonAmoy, sepolia],
  transports: {
    [sepolia.id]: http(),
    [polygonAmoy.id]: http(),
    [polygonMumbai.id]: http(),
  },
});
const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen={false} />
          <ToastContainer />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
});
