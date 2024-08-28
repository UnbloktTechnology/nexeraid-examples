import { Inter } from "next/font/google";
import styles from "../../kyc-widget/client.module.css";
import { KYCClientCosmos } from "../components/cosmos/KYCClientCosmos";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NexeraIdProvider } from "@nexeraid/react-sdk";
import { nexeraIdCosmosConfig } from "@/features/root/web3/sdk-config/nexeraIdCosmosConfig";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export const CosmosSupportPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NexeraIdProvider config={nexeraIdCosmosConfig}>
        <main className={`${inter.className} ${styles.main}`}>
          <KYCClientCosmos />
        </main>
      </NexeraIdProvider>
    </QueryClientProvider>
  );
};
