import dynamic from "next/dynamic";
import { KYCLayout } from "@/features/kyc-airdrop/ui/KYCLayout";
import { SearchBar } from "@/features/kyc-airdrop/ui/components/SearchBar";
import { ConnectButtonCustom } from "@/features/kyc-airdrop/ui/components/ConnectButtonCustom";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";

const KYCAirdropPageWrapper = () => {
  const { connector } = useAccount();
  const router = useRouter();
  const mustReset = router.query.reset as string;

  if (mustReset) {
    void connector?.disconnect();
  }

  return (
    <KYCLayout
      title="Let's claim some tokens"
      subtitle="Connect your wallet to claim tokens"
    >
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <SearchBar />
        or
        <ConnectButtonCustom label="Connect the wallet" variant="secondary" />
      </div>
    </KYCLayout>
  );
};

const DynamicKYCAirdropPageWrapper = dynamic(
  () => Promise.resolve(KYCAirdropPageWrapper),
  { ssr: false },
);

export default function KycAirdrop() {
  return <DynamicKYCAirdropPageWrapper />;
}
