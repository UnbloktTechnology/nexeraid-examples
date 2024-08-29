import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import {
  generateSubtitleFromWalletState,
  generateTitleFromWalletState,
  useWalletCheck,
  type WalletState,
} from "@/kyc-airdrop/useWalletCheck";
import { AirdropLayout } from "@/kyc-airdrop/ui/AirdropLayout";
import { Button } from "@/kyc-airdrop/ui/components/Button";
import { type Address } from "@nexeraid/identity-schemas";
import { ConnectButtonCustom } from "@/kyc-airdrop/ui/components/ConnectButtonCustom";
import { RedirectToHomeButton } from "@/kyc-airdrop/ui/components/RedirectToHomeButton";
import {
  useCustomerStatus,
  useIsLoading,
  useOpenWidget,
} from "@nexeraid/react-sdk";

const AirdropPageWrapper = () => {
  const router = useRouter();
  const address = router.query.address as Address;

  const { claimWallet, isClaiming, walletClient, isQualified, allowance } =
    useWalletCheck();

  const walletState: WalletState = isQualified
    ? "HAS_ALLOWANCE_CONNECTED"
    : "IS_NOT_QUALIFIED";

  const customerStatus = useCustomerStatus();
  const openWidget = useOpenWidget({});
  const isWidgetLoading = useIsLoading();

  const isCustomerActive = customerStatus === "Active";

  const renderKycButton = () => {
    return (
      !isCustomerActive && (
        <Button
          variant="secondary"
          onClick={openWidget}
          disabled={isWidgetLoading}
          id="identity-btn"
          isLoading={isWidgetLoading}
        >
          Begin identity verification
        </Button>
      )
    );
  };

  const renderClaimButton = () => {
    return (
      isCustomerActive && (
        <Button
          variant="secondary"
          disabled={!walletClient || isClaiming}
          onClick={claimWallet}
          id="claim-btn"
          isLoading={isClaiming}
        >
          Claim tokens
        </Button>
      )
    );
  };

  return (
    <AirdropLayout
      title={generateTitleFromWalletState(walletState)}
      subtitle={generateSubtitleFromWalletState({
        walletState,
        address,
        allowance: allowance instanceof Error ? 0n : allowance,
        isCustomerActive,
        isAuthorized: isCustomerActive,
      })}
    >
      {renderKycButton()}
      {renderClaimButton()}

      <Button isLoading={true} variant="secondary">
        Loading...
      </Button>
      <RedirectToHomeButton variant="primary" label="Try another wallet" />
      <ConnectButtonCustom label="Connect wallet" variant="secondary" />
      <RedirectToHomeButton />
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
