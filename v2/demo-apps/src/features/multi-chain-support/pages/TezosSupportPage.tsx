import { Inter } from "next/font/google";
import styles from "../../kyc-widget/client.module.css";
import { useState } from "react";
import { KYCClientTezos } from "../components/tezos/KYCClientTezos";

const inter = Inter({ subsets: ["latin"] });

export const TezosSupportPage = () => {
  const [did, setDID] = useState<string | undefined>(undefined);
  return (
    <main className={`${inter.className} ${styles.main}`}>
      <KYCClientTezos setDID={setDID} />
      {did ? (
        <div>DID:{did}</div>
      ) : (
        <div>Waiting for Tezos Wallet instantiation...</div>
      )}
    </main>
  );
};
