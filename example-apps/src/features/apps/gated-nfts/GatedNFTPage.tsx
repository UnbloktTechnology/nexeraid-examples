import { Inter } from "next/font/google";
import styles from "@/features/identity-widget/client.module.css";
import { KYCClientEIP155 } from "@/features/identity-widget/KYCClientEIP155";
import { useState } from "react";
import { GatedNFT } from "./components/GatedNFT";

const inter = Inter({ subsets: ["latin"] });

export const GatedNFTPage = () => {
  const [did, setDID] = useState<string | undefined>(undefined);
  return (
    <main className={`${inter.className} ${styles.main}`}>
      <KYCClientEIP155 setDID={setDID} />
      <GatedNFT did={did} />
    </main>
  );
};
