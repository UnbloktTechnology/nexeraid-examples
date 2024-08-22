import { Inter } from "next/font/google";
import styles from "../../kyc-widget/client.module.css";
import { KYCClientPolkadot } from "../components/polkadot/KYCClientPolkadot";

const inter = Inter({ subsets: ["latin"] });

export const PolkadotSupportPage = () => {
  return (
    <main className={`${inter.className} ${styles.main}`}>
      <KYCClientPolkadot />
    </main>
  );
};
