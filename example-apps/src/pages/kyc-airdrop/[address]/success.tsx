import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { AirdropLayout } from "@/features/kyc-airdrop/ui/AirdropLayout";
import { useGetTokenBalance } from "@/features/kyc-airdrop/utils/useGetTokenBalance";
import { useRouter } from "next/router";
import { RedirectToHomeButton } from "@/features/kyc-airdrop/ui/components/RedirectToHomeButton";

const AirdropPageWrapper = () => {
  const balance = useGetTokenBalance();
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);
  const router = useRouter();
  const address = router.query.address as string;

  useEffect(() => {
    if (balance.balance) {
      setIsBalanceLoading(false);
    }
  }, [balance]);

  const title = isBalanceLoading
    ? "Claiming your tokens..."
    : "Tokens claimed successfully";

  const subtitle = isBalanceLoading
    ? "Checking wallet balance..."
    : `Congrats! The allocated ${balance.balance} PEAQ were transferred to the wallet ${address}`;

  return (
    <AirdropLayout title={title} subtitle={subtitle}>
      <RedirectToHomeButton variant="secondary" label="Try another wallet" />
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
