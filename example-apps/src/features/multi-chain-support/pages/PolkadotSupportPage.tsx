import { Inter } from "next/font/google";
import styles from "../../kyc-widget/client.module.css";
import { useState } from "react";
import { KYCClientPolkadot } from "../components/polkadot/KYCClientPolkadot";

const inter = Inter({ subsets: ["latin"] });

export const PolkadotSupportPage = () => {
  const [did, setDID] = useState<string | undefined>(undefined);
  return (
    <main className={`${inter.className} ${styles.main}`}>
      <KYCClientPolkadot setDID={setDID} />
      {did ? (
        <div>DID:{did}</div>
      ) : (
        <div>Waiting for Polkadot Wallet instantiation...</div>
      )}
    </main>
  );
};
