import { Inter } from "next/font/google";
import styles from "../../kyc-widget/client.module.css";
import { KYCClientCardano } from "../components/cardano/KYCClientCardano";

const inter = Inter({ subsets: ["latin"] });

export const CardanoSupportPage = () => {
  return (
    <main className={`${inter.className} ${styles.main}`}>
      <KYCClientCardano />
    </main>
  );
};
