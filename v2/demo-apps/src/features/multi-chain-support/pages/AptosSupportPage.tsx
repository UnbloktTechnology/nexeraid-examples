import { Inter } from "next/font/google";
import styles from "../../kyc-widget/client.module.css";
import { KYCClientAptos } from "../components/aptos/KYCClientAptos";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NexeraIdProvider } from "@nexeraid/react-sdk";
import { nexeraIdAptosConfig } from "@/features/root/web3/sdk-config/nexeraIdAptosConfig";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export const AptosSupportPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NexeraIdProvider config={nexeraIdAptosConfig}>
        <main className={`${inter.className} ${styles.main}`}>
          <KYCClientAptos />
        </main>
      </NexeraIdProvider>
    </QueryClientProvider>
  );
};
