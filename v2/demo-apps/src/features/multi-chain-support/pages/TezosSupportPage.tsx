import { Inter } from "next/font/google";
import styles from "../../kyc-widget/client.module.css";
import { KYCClientTezos } from "../components/tezos/KYCClientTezos";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NexeraIdProvider } from "@nexeraid/react-sdk";
import { nexeraIdTezosConfig } from "@/features/root/web3/sdk-config/nexeraIdTezosConfig";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export const TezosSupportPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NexeraIdProvider config={nexeraIdTezosConfig}>
        <main className={`${inter.className} ${styles.main}`}>
          <KYCClientTezos />
        </main>
      </NexeraIdProvider>
    </QueryClientProvider>
  );
};
