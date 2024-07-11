import { Inter } from "next/font/google";
import styles from "../kyc-widget/client.module.css";
import { KYCClientEIP155 } from "../kyc-widget/KYCClientEIP155";
import { useState } from "react";
import { KYCAirdrop } from "./components/KYCAirdrop";
import Image from "next/image";

import stylesPeaq from "./peaq.module.css";
import KYCAirdropFooter from "./components/ui/KYCAirdropFooter";
import { KYCProvider } from "./providers/KYCContext";

const inter = Inter({ subsets: ["latin"] });

export const KYCAirdropPage = () => {
  const [did, setDID] = useState<string | undefined>(undefined);
  return (
    <main className={`bg-white !p-0 ${inter.className} ${styles.main}`}>
      <header className="flex w-full items-center justify-between  p-4 pb-0">
        <Image
          src="/images/peaq-logo.png"
          alt="Logo"
          width={100}
          height={100}
        />
        <nav>
          <ul className="flex space-x-4">
            <li>Learn</li>
            <li>Build</li>
            <li>Community</li>
          </ul>
        </nav>
      </header>
      <div className="w-full">
        <div className="p-4 pb-20">
          <div
            className={`${stylesPeaq.bg} flex min-h-screen items-center justify-center p-8`}
          >
            <section className="w-full max-w-xl rounded-lg px-8 py-20 text-center text-white">
              <h1 className="font-aeonix-regular mb-4 text-4xl">
                Headline with cool text goes here
              </h1>
              <div className="mb-4 flex flex-col items-center justify-center gap-4">
                <KYCProvider>
                  <KYCClientEIP155 setDID={setDID} />
                  <KYCAirdrop did={did} />
                </KYCProvider>
              </div>
              <p className="mt-4">Maybe some T&C should go here</p>
            </section>
          </div>
        </div>
        <KYCAirdropFooter />
      </div>
    </main>
  );
};
