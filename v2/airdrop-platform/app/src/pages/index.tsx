import { AirdropLayout } from "@/kyc-airdrop/ui/AirdropLayout";
import { SearchBar } from "@/kyc-airdrop/ui/components/SearchBar";
import { ConnectButtonCustom } from "@/kyc-airdrop/ui/components/ConnectButtonCustom";
import { generateSubtitleFromWalletState, generateTitleFromWalletState, useWalletCheck } from "@/kyc-airdrop/useWalletCheck";

const Home = () => {
  const { isConnected } = useWalletCheck();
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

export default Home;
