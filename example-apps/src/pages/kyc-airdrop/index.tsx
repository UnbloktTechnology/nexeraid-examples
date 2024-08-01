import dynamic from "next/dynamic";
import { AirdropLayout } from "@/features/kyc-airdrop/ui/AirdropLayout";
import { SearchBar } from "@/features/kyc-airdrop/ui/components/SearchBar";
import { ConnectButtonCustom } from "@/features/kyc-airdrop/ui/components/ConnectButtonCustom";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";

const AirdropPageWrapper = () => {
  const { address: loadedAddress } = useAccount();
  const router = useRouter();
  const address = router.query.address as string;

  return (
    <AirdropLayout
      title="Let's claim some tokens"
      subtitle="Connect your wallet to claim tokens"
    >
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <SearchBar />
        or
        <ConnectButtonCustom
          label="Connect the wallet"
          variant="secondary"
          forceDisconnect={(!address as boolean) && !loadedAddress}
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
