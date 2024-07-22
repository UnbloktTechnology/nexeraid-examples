import dynamic from "next/dynamic";
import { KYCLayout } from "@/features/kyc-airdrop/ui/KYCLayout";
import { SearchBar } from "@/features/kyc-airdrop/ui/components/SearchBar";
import { ConnectButtonCustom } from "@/features/kyc-airdrop/ui/components/ConnectButtonCustom";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";

const KYCAirdropPageWrapper = () => {
  const router = useRouter();
  const { isConnecting } = useAccount();
  const mustReset = router.query.reset as string;

  return (
    <KYCLayout
      title="Let's claim some tokens"
      subtitle="Connect your wallet to claim tokens"
    >
      <div className="flex w-full flex-col items-center justify-center gap-4">
        {isConnecting && <>loading...</>}
        {!isConnecting && (
          <>
            <SearchBar />
            or
            <ConnectButtonCustom
              label="Connect the wallet"
              variant="secondary"
              forceDisconnect={!!mustReset}
            />
          </>
        )}
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
