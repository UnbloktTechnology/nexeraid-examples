import { Inter } from "next/font/google";
import styles from "../../kyc-widget/client.module.css";
import { KYCClientAgung } from "../components/polkadot/KYCClientAgung";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NexeraIdProvider } from "@nexeraid/react-sdk";
import { nexeraIdAgungConfig } from "@/features/root/web3/sdk-config/nexeraIdAgungConfig";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export const AgungSupportPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NexeraIdProvider config={nexeraIdAgungConfig}>
        <main className={`${inter.className} ${styles.main}`}>
          <KYCClientAgung />
        </main>
      </NexeraIdProvider>
    </QueryClientProvider>
  );
};
