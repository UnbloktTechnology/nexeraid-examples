import { Inter } from "next/font/google";
import styles from "../../kyc-widget/client.module.css";
import { KYCClientTezos } from "../components/tezos/KYCClientTezos";

const inter = Inter({ subsets: ["latin"] });

export const TezosSupportPage = () => {
  return (
    <main className={`${inter.className} ${styles.main}`}>
      <KYCClientTezos />
    </main>
  );
};
