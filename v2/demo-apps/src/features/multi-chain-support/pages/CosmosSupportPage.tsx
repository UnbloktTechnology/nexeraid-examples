import { Inter } from "next/font/google";
import styles from "../../kyc-widget/client.module.css";
import { KYCClientCosmos } from "../components/cosmos/KYCClientCosmos";

const inter = Inter({ subsets: ["latin"] });

export const CosmosSupportPage = () => {
  return (
    <main className={`${inter.className} ${styles.main}`}>
      <KYCClientCosmos />
    </main>
  );
};
