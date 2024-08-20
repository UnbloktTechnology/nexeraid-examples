import { Inter } from "next/font/google";
import styles from "../kyc-widget/client.module.css";
import { useState } from "react";
import { GatedNFTTezos } from "./components/GatedNFTTezos";
import { KYCClientTezos } from "../multi-chain-support/components/tezos/KYCClientTezos";

const inter = Inter({ subsets: ["latin"] });

export const GatedNFTPageTezos = () => {
  const [did, setDID] = useState<string | undefined>(undefined);
  return (
    <main className={`${inter.className} ${styles.main}`}>
      <KYCClientTezos setDID={setDID} />
      <GatedNFTTezos did={did} />
    </main>
  );
};
