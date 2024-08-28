import { Inter } from "next/font/google";
import styles from "../../kyc-widget/client.module.css";
import { KYCClientStarknet } from "../components/starknet/KYCClientStarknet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NexeraIdProvider } from "@nexeraid/react-sdk";
import { nexeraIdStarknetConfig } from "@/features/root/web3/sdk-config/nexeraIdStarknetConfig";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export const StarknetSupportPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NexeraIdProvider config={nexeraIdStarknetConfig}>
        <main className={`${inter.className} ${styles.main}`}>
          <KYCClientStarknet />
        </main>
      </NexeraIdProvider>
    </QueryClientProvider>
  );
};
