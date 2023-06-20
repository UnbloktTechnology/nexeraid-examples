"use client";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Inter } from "next/font/google";
import styles from "./client.module.css";
import { KYCFlow } from "./KYCFlow";
import { WebHooks } from "../webhooks/WebHooks";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const inter = Inter({ subsets: ["latin"] });

const Client = () => {
  const account = useAccount();
  return (
    <main className={`${inter.className} ${styles.main}`}>
      {account && (
        <>
          <ConnectButton />
          {account && (
            <div>
              <KYCFlow />
              <WebHooks />
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default Client;
