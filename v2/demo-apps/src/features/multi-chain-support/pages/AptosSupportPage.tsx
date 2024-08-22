import { Inter } from "next/font/google";
import styles from "../../kyc-widget/client.module.css";
import { KYCClientAptos } from "../components/aptos/KYCClientAptos";

const inter = Inter({ subsets: ["latin"] });

export const AptosSupportPage = () => {
  return (
    <main className={`${inter.className} ${styles.main}`}>
      <KYCClientAptos />
    </main>
  );
};
