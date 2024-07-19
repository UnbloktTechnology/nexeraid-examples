import dynamic from "next/dynamic";
import React from "react";
import { KYCLayout } from "@/features/kyc-airdrop/ui/KYCLayout";
import { useRouter } from "next/router";
import { Button } from "@/features/kyc-airdrop/ui/components/Button";
import { useWalletCheck } from "@/features/kyc-airdrop/hooks/useWalletCheck";

const KYCAirdropPageWrapper = () => {
  const router = useRouter();
  const error = router.query.error as string;
  const { handleTryAnotherWallet } = useWalletCheck();

  return (
    <KYCLayout
      title={"Tokens claim unsuccessful"}
      subtitle="Unfortunately, we can't allow token claim for you due to :"
    >
      <textarea
        className="border-white-400 focus:ring-white-400 h-24 w-full max-w-md resize-none rounded-lg border bg-slate-500 bg-opacity-25 p-4 text-white placeholder-gray-300 focus:border-transparent focus:outline-none focus:ring-2"
        placeholder="Reason for rejection goes here"
        readOnly
      >
        {error}
      </textarea>
      <Button variant="secondary" onClick={() => void handleTryAnotherWallet()}>
        Try again
      </Button>
    </KYCLayout>
  );
};

const DynamicKYCAirdropPageWrapper = dynamic(
  () => Promise.resolve(KYCAirdropPageWrapper),
  { ssr: false },
);

export default function AllocationCheck() {
  return <DynamicKYCAirdropPageWrapper />;
}
