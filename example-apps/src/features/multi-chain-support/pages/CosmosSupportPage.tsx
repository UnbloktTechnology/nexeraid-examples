import { Inter } from "next/font/google";
import styles from "../../kyc-widget/client.module.css";
import { useState } from "react";
import { KYCClientCosmos } from "../components/cosmos/KYCClientCosmos";

const inter = Inter({ subsets: ["latin"] });

export const CosmosSupportPage = () => {
  const [did, setDID] = useState<string | undefined>(undefined);
  return (
    <main className={`${inter.className} ${styles.main}`}>
      <KYCClientCosmos setDID={setDID} />
      {did ? (
        <div>DID:{did}</div>
      ) : (
        <div>Waiting for Cosmos Wallet instantiation...</div>
      )}
    </main>
  );
};
