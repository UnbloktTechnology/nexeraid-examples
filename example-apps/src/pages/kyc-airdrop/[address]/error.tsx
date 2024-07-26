import dynamic from "next/dynamic";
import React from "react";
import { AirdropLayout } from "@/features/kyc-airdrop/ui/AirdropLayout";
import { useRouter } from "next/router";
import { Button } from "@/features/kyc-airdrop/ui/components/Button";
import { useWalletCheck } from "@/features/kyc-airdrop/hooks/useWalletCheck";
import { type Address } from "@nexeraprotocol/identity-schemas";

const AirdropPageWrapper = () => {
  const router = useRouter();
  const error = router.query.error as string;
  const address = router.query.address as string;
  const { handleTryAnotherWallet, handleTryWalletAgain } = useWalletCheck();

  return (
    <AirdropLayout
      title={"Tokens claim unsuccessful"}
      subtitle="Unfortunately, we can't allow token claim for you due to :"
    >
      <textarea
        className="border-white-400 focus:ring-white-400 h-24 w-full max-w-md resize-none rounded-lg border bg-slate-500 bg-opacity-25 p-4 text-white placeholder-gray-300 focus:border-transparent focus:outline-none focus:ring-2"
        placeholder="Reason for rejection goes here"
        readOnly
        defaultValue={error}
        maxLength={error.length}
      />

      <div className="flex w-full flex-row items-center justify-center gap-4">
        <Button
          variant="primary"
          onClick={() => void handleTryWalletAgain(address as Address)}
        >
          Try again
        </Button>

        <Button
          variant="secondary"
          onClick={() => void handleTryAnotherWallet()}
        >
          Try another wallet
        </Button>
      </div>
    </AirdropLayout>
  );
};

const DynamicAirdropPageWrapper = dynamic(
  () => Promise.resolve(AirdropPageWrapper),
  { ssr: false },
);

export default function AllocationCheck() {
  return <DynamicAirdropPageWrapper />;
}
