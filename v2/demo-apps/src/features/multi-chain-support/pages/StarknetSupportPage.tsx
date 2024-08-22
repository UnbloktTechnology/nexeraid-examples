import { Inter } from "next/font/google";
import styles from "../../kyc-widget/client.module.css";
import { KYCClientStarknet } from "../components/starknet/KYCClientStarknet";

const inter = Inter({ subsets: ["latin"] });

export const StarknetSupportPage = () => {
  return (
    <main className={`${inter.className} ${styles.main}`}>
      <KYCClientStarknet />
    </main>
  );
};
