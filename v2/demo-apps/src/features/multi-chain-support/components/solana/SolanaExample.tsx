import { Inter } from "next/font/google";
import styles from "../../../kyc-widget/client.module.css";
import { useState } from "react";
import { KYCClientSolana } from "./KYCClientSolana";

const inter = Inter({ subsets: ["latin"] });

export const SolanaExample = () => {
  const [did, setDID] = useState<string | undefined>(undefined);
  return (
    <main className={`${inter.className} ${styles.main}`}>
      <KYCClientSolana setDID={setDID} />
      {did ? (
        <div>DID:{did}</div>
      ) : (
        <div>Waiting for Solana Wallet instantiation...</div>
      )}
    </main>
  );
};
