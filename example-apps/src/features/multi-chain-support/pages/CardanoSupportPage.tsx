import { Inter } from "next/font/google";
import styles from "../../kyc-widget/client.module.css";
import { useState } from "react";
import { KYCClientCardano } from "../components/cardano/KYCClientCardano";

const inter = Inter({ subsets: ["latin"] });

export const CardanoSupportPage = () => {
  const [did, setDID] = useState<string | undefined>(undefined);
  return (
    <main className={`${inter.className} ${styles.main}`}>
      <KYCClientCardano setDID={setDID} />
      {did ? (
        <div>DID:{did}</div>
      ) : (
        <div>Waiting for Cardano Wallet instantiation...</div>
      )}
    </main>
  );
};
