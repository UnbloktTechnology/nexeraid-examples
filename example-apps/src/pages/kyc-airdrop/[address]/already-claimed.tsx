import dynamic from "next/dynamic";
import { KYCLayout } from "@/features/kyc-airdrop/ui/KYCLayout";
import { SearchBar } from "@/features/kyc-airdrop/ui/components/SearchBar";
import { ConnectButtonCustom } from "@/features/kyc-airdrop/ui/components/ConnectButtonCustom";
import { useRouter } from "next/router";

const KYCAirdropPageWrapper = () => {
  const router = useRouter();
  const address = router.query.address as string;

  return (
    <KYCLayout
      title="Tokens were already claimed"
      subtitle={`Wallet ${address} already claimed tokens`}
    >
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <SearchBar placeholder="Try another wallet address here" />
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
