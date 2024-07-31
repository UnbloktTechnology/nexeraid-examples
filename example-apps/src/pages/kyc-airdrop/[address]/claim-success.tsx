import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { AirdropLayout } from "@/features/kyc-airdrop/ui/AirdropLayout";
import { useGetTokenBalance } from "@/features/kyc-airdrop/utils/useGetTokenBalance";
import { useRouter } from "next/router";
import { Button } from "@/features/kyc-airdrop/ui/components/Button";
import { useWalletCheck } from "@/features/kyc-airdrop/hooks/useWalletCheck";

const AirdropPageWrapper = () => {
  const balance = useGetTokenBalance();
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);
  const { handleTryAnotherWallet } = useWalletCheck();
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
      <Button variant="secondary" onClick={() => void handleTryAnotherWallet()}>
        Try another wallet
      </Button>
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
