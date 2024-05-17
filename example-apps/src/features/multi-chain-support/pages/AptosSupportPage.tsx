import { Inter } from "next/font/google";
import styles from "../../kyc-widget/client.module.css";
import { useState } from "react";
import { KYCClientAptos } from "../components/aptos/KYCClientAptos";

const inter = Inter({ subsets: ["latin"] });

export const AptosSupportPage = () => {
  const [did, setDID] = useState<string | undefined>(undefined);
  return (
    <main className={`${inter.className} ${styles.main}`}>
      <KYCClientAptos setDID={setDID} />
      {did ? (
        <div>DID:{did}</div>
      ) : (
        <div>Waiting for Polygon Wallet instantiation...</div>
      )}
    </main>
  );
};
