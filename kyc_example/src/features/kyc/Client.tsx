import { useAccount } from "wagmi";
import { Inter } from "next/font/google";
import styles from "./client.module.css";
import { KYCFlow } from "./KYCFlow";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const inter = Inter({ subsets: ["latin"] });

export const Client = () => {
  const account = useAccount();
  return (
    <main className={`${inter.className} ${styles.main}`}>
      <>
        <ConnectButton />
        {account && <KYCFlow />}
      </>
    </main>
  );
};
