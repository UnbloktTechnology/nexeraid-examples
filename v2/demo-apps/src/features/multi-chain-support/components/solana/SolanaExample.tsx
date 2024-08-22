import { Inter } from "next/font/google";
import styles from "../../../kyc-widget/client.module.css";
import { useState } from "react";
import { KYCClientSolana } from "./KYCClientSolana";

const inter = Inter({ subsets: ["latin"] });

export const SolanaExample = () => {
  return (
    <main className={`${inter.className} ${styles.main}`}>
      <KYCClientSolana />
    </main>
  );
};
