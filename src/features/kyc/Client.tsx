import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Inter } from "next/font/google";
import styles from "./client.module.css";
import { KYCFlow } from "./KYCFlow";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const inter = Inter({ subsets: ["latin"] });

const Client = () => {
  const account = useAccount();
  return (
    <body>
      <main className={`${inter.className} ${styles.main}`}>
        {account && (
          <>
            <ConnectButton />
            <KYCFlow />
          </>
        )}
      </main>
    </body>
  );
};

export default Client;
