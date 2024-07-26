import dynamic from "next/dynamic";
import { AirdropLayout } from "@/features/kyc-airdrop/ui/AirdropLayout";
import { SearchBar } from "@/features/kyc-airdrop/ui/components/SearchBar";
import { ConnectButtonCustom } from "@/features/kyc-airdrop/ui/components/ConnectButtonCustom";
import { useRouter } from "next/router";

const AirdropPageWrapper = () => {
  const router = useRouter();
  const address = router.query.address as string;

  return (
    <AirdropLayout
      title="No allocation"
      subtitle={`Unfortunately, there is no allocation for the wallet ${address}`}
    >
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <SearchBar placeholder="Try another wallet address here" />
        or
        <ConnectButtonCustom label="Connect the wallet" variant="secondary" />
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
