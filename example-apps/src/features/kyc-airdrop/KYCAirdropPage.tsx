import { KYCClientAirdrop } from "./KYCClientAirdrop";
import { useEffect, useState } from "react";
import { KYCClaimAirdrop } from "./components/KYCClaimAirdrop";
import Image from "next/image";

import stylesPeaq from "./peaq.module.css";
import KYCAirdropFooter from "./components/ui/KYCAirdropFooter";
import { useKYCContext } from "./providers/KYCContext";
import { useGetTokenBalance } from "./utils/useGetTokenBalance";

export const KYCAirdropPage = () => {
  const [did, setDID] = useState<string | undefined>(undefined);
  const { isWalletWhitelisted, isWalletChecked, isWalletFailedClaim } =
    useKYCContext();
  const [title, setTitle] = useState<string>("Let's claim some tokens");
  const [subtitle, setSubtitle] = useState<string>(
    "Connect your wallet to claim tokens",
  );
  const balance = useGetTokenBalance();
  const isWalletClaimed = balance.balance && Number(balance.balance) > 0;

  useEffect(() => {
    if (isWalletClaimed) {
      setTitle("Tokens claimed successfully");
      setSubtitle(
        `Congrats! Your wallet should have claimed your ${balance.balance} tokens`,
      );
    } else if (isWalletChecked && isWalletWhitelisted) {
      setTitle("This wallet qualifies");
      setSubtitle(
        "Congrats! Now we need to verify your identity before you can claim your tokens",
      );
    } else if (isWalletChecked && !isWalletWhitelisted) {
      setTitle("This wallet doesn't qualify");
      setSubtitle(
        "Unfortunately, this wallet doesn't qualify for the airdrop. Please try again with a different wallet",
      );
    } else if (isWalletFailedClaim) {
      setTitle("Tokens claim unsuccessful");
      setSubtitle("Unfortunately, we can't allow token claim for this wallet");
    }
  }, [
    isWalletClaimed,
    isWalletWhitelisted,
    isWalletChecked,
    isWalletFailedClaim,
    balance,
  ]);

  return (
    <main className={`${stylesPeaq.main} bg-white !p-0`}>
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
            <section className="flex w-full max-w-xl flex-col gap-4 rounded-lg px-8 py-20 text-center text-white">
              <h1 className="text-4xl">{title}</h1>
              <h2 className="text-2xl">{subtitle}</h2>
              {!isWalletClaimed && (
                <div className="flex flex-col items-center justify-center gap-4">
                  <KYCClientAirdrop setDID={setDID} />
                  <KYCClaimAirdrop did={did} />
                </div>
              )}

              <a className="underline" href="#">
                Terms and conditions
              </a>
            </section>
          </div>
        </div>
        <KYCAirdropFooter />
      </div>
    </main>
  );
};
