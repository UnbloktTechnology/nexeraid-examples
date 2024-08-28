import { Inter } from "next/font/google";
import styles from "../../kyc-widget/client.module.css";
import { KYCClientCardano } from "../components/cardano/KYCClientCardano";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NexeraIdProvider } from "@nexeraid/react-sdk";
import { nexeraIdCardanoConfig } from "@/features/root/web3/sdk-config/nexeraIdCardanoConfig";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export const CardanoSupportPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NexeraIdProvider config={nexeraIdCardanoConfig}>
        <main className={`${inter.className} ${styles.main}`}>
          <KYCClientCardano />
        </main>
      </NexeraIdProvider>
    </QueryClientProvider>
  );
};
