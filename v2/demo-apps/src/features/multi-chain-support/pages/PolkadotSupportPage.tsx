import { Inter } from "next/font/google";
import styles from "../../kyc-widget/client.module.css";
import { KYCClientPolkadot } from "../components/polkadot/KYCClientPolkadot";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NexeraIdProvider } from "@nexeraid/react-sdk";
import { nexeraIdPolkadotConfig } from "@/features/root/web3/sdk-config/nexeraIdPolkadotConfig";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export const PolkadotSupportPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NexeraIdProvider config={nexeraIdPolkadotConfig}>
        <main className={`${inter.className} ${styles.main}`}>
          <KYCClientPolkadot />
        </main>
      </NexeraIdProvider>
    </QueryClientProvider>
  );
};
