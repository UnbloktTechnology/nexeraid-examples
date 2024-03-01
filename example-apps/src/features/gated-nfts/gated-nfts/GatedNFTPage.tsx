import { Inter } from "next/font/google";
import styles from "./client.module.css";
import { KYCClient } from "./identity/KYCClient";
import { useState } from "react";
import { GatedNFT } from "./blockchain/GatedNFT";

const inter = Inter({ subsets: ["latin"] });

export const GatedNFTPage = () => {
  const [did, setDID] = useState<string | undefined>(undefined);
  return (
    <main className={`${inter.className} ${styles.main}`}>
      <KYCClient setDID={setDID} />
      <GatedNFT did={did} />
    </main>
  );
};
