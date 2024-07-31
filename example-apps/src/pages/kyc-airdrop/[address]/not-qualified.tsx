import dynamic from "next/dynamic";
import { AirdropLayout } from "@/features/kyc-airdrop/ui/AirdropLayout";
import { SearchBar } from "@/features/kyc-airdrop/ui/components/SearchBar";
import { useRouter } from "next/router";
import { ConnectButtonCustom } from "@/features/kyc-airdrop/ui/components/ConnectButtonCustom";

const AirdropPageWrapper = () => {
  const router = useRouter();
  const address = router.query.address as string;

  return (
    <AirdropLayout
      title="This wallet doesn't qualify"
      subtitle={`Unfortunately, the wallet ${address} doesn't qualify`}
    >
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <SearchBar placeholder="Try another wallet address here" />
        or
        <ConnectButtonCustom
          label="Connect another wallet"
          variant="secondary"
        />
      </div>
    </AirdropLayout>
  );
};

const DynamicAirdropPageWrapper = dynamic(
  () => Promise.resolve(AirdropPageWrapper),
  { ssr: false },
);

export default function Airdrop() {
  return <DynamicAirdropPageWrapper />;
}
