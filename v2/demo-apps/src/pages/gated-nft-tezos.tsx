import { GatedNFTPageTezos } from "@/features/gated-nfts/GatedNFTPageTezos";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NexeraIdProvider } from "@nexeraid/react-sdk";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import { nexeraIdConfig } from "@/features/gated-nfts/utils/tezos/nexeraIdConfig";

const queryClient = new QueryClient();

const Home = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NexeraIdProvider config={nexeraIdConfig}>
        <GatedNFTPageTezos />
        <ReactQueryDevtools initialIsOpen={false} />
        <ToastContainer />
      </NexeraIdProvider>
    </QueryClientProvider>
  );
};

export default Home;
