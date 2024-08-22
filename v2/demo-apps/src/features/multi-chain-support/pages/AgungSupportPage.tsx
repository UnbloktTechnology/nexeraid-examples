import { Inter } from "next/font/google";
import styles from "../../kyc-widget/client.module.css";
import { KYCClientAgung } from "../components/polkadot/KYCClientAgung";

const inter = Inter({ subsets: ["latin"] });

export const AgungSupportPage = () => {
  return (
    <main className={`${inter.className} ${styles.main}`}>
      <KYCClientAgung />
    </main>
  );
};
