import dynamic from "next/dynamic";
import React from "react";
import { KYCLayout } from "@/features/kyc-airdrop/ui/KYCLayout";
import { useGetTokenBalance } from "@/features/kyc-airdrop/utils/useGetTokenBalance";
import { useRouter } from "next/router";
import { Button } from "@/features/kyc-airdrop/ui/components/Button";
import { useAccount } from "wagmi";

const KYCAirdropPageWrapper = () => {
  const balance = useGetTokenBalance();
  const { connector } = useAccount();
  const router = useRouter();

  const handleTryAnotherWallet = async () => {
    await connector?.disconnect();
    void router.push({
      pathname: "/kyc-airdrop",
      query: {
        reset: "true",
      },
    });
  };

  const address = router.query.address as string;
  return (
    <KYCLayout
      title={"Tokens claimed successfully"}
      subtitle={`Congrats! The allocated ${balance.balance} PEAQ were transferred to the wallet ${address}`}
    >
      <Button variant="secondary" onClick={() => void handleTryAnotherWallet()}>
        Try another wallet
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
