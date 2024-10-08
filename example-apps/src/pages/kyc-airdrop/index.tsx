import dynamic from "next/dynamic";
import { AirdropLayout } from "@/features/kyc-airdrop/ui/AirdropLayout";
import { SearchBar } from "@/features/kyc-airdrop/ui/components/SearchBar";
import { ConnectButtonCustom } from "@/features/kyc-airdrop/ui/components/ConnectButtonCustom";
import { useWalletCheck } from "@/features/kyc-airdrop/hooks/useWalletCheck";

const AirdropPageWrapper = () => {
  const {
    isConnected,
    generateTitleFromWalletState,
    generateSubtitleFromWalletState,
  } = useWalletCheck();
  return (
    <AirdropLayout
      title={generateTitleFromWalletState()}
      subtitle={generateSubtitleFromWalletState()}
    >
      <div className="flex w-full flex-col items-center justify-center gap-4">
        {!isConnected && (
          <>
            <SearchBar />
            or
          </>
        )}
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
