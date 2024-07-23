import dynamic from "next/dynamic";
import { KYCLayout } from "@/features/kyc-airdrop/ui/KYCLayout";
import { SearchBar } from "@/features/kyc-airdrop/ui/components/SearchBar";
import { useRouter } from "next/router";

const KYCAirdropPageWrapper = () => {
  const router = useRouter();
  const address = router.query.address as string;

  return (
    <KYCLayout
      title="This wallet doesn't qualify"
      subtitle={`Unfortunately, the wallet ${address} doesn't qualify for some reason`}
    >
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <SearchBar placeholder="Try another wallet address here" />
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
