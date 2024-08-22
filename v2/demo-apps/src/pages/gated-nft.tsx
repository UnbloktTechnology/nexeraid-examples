import { GatedNFTPage } from "@/features/gated-nfts/GatedNFTPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/features/root/identity/wagmiConfig";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { NexeraIdProvider } from "@nexeraid/react-sdk";
import { nexeraIdConfig } from "@/features/gated-nfts/utils/evm/nexeraIdConfig";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient();

const Home = () => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <NexeraIdProvider config={nexeraIdConfig}>
            <GatedNFTPage />
            <ReactQueryDevtools initialIsOpen={false} />
            <ToastContainer />
          </NexeraIdProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Home;
