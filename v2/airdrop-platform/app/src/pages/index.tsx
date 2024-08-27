import { AirdropLayout } from "@/features/kyc-airdrop/ui/AirdropLayout";
import { SearchBar } from "@/features/kyc-airdrop/ui/components/SearchBar";
import { ConnectButtonCustom } from "@/features/kyc-airdrop/ui/components/ConnectButtonCustom";
import { generateSubtitleFromWalletState, generateTitleFromWalletState, useWalletCheck } from "@/features/kyc-airdrop/hooks/useWalletCheck";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/features/root/identity/wagmiConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { NexeraIdProvider } from "@nexeraid/react-sdk";
import { nexeraIdConfig } from "@/features/kyc-airdrop/utils/nexeraIdConfig";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient();

const Home = () => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <NexeraIdProvider config={nexeraIdConfig}>
            <HomeContent />
            <ReactQueryDevtools initialIsOpen={false} />
            <ToastContainer />
          </NexeraIdProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
const HomeContent = () => {
  const {
    isConnected,
  } = useWalletCheck();
  return (
    <AirdropLayout
      title={generateTitleFromWalletState()}
      subtitle={generateSubtitleFromWalletState()}
    >
      <div className="flex w-full flex-col items-center justify-center gap-4">
        {!isConnected && (
          <>
            <SearchBar />
            or
          </>
        )}
        <ConnectButtonCustom label="Connect the wallet" variant="secondary" />
      </div>
    </AirdropLayout>
  );
};

export default Home;
