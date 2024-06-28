import { Inter } from "next/font/google";
import styles from "../../kyc-widget/client.module.css";
import { useState } from "react";
import { KYCClientStarknet } from "../components/starknet/KYCClientStarknet";

const inter = Inter({ subsets: ["latin"] });

export const StarknetSupportPage = () => {
  const [did, setDID] = useState<string | undefined>(undefined);
  return (
    <main className={`${inter.className} ${styles.main}`}>
      <KYCClientStarknet setDID={setDID} />
      {did ? (
        <div>DID:{did}</div>
      ) : (
        <div>Waiting for Starknet Wallet instantiation...</div>
      )}
    </main>
  );
};
