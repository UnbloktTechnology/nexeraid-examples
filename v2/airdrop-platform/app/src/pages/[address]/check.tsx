import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import {
  checkWalletState,
  generateSubtitleFromWalletState,
  generateTitleFromWalletState,
  useWalletCheck,
  type WalletState,
} from "@/features/kyc-airdrop/hooks/useWalletCheck";
import { AirdropLayout } from "@/features/kyc-airdrop/ui/AirdropLayout";
import { Button } from "@/features/kyc-airdrop/ui/components/Button";
import { useCallback, useEffect, useState } from "react";
import { type Address } from "@nexeraid/identity-schemas";
import { ConnectButtonCustom } from "@/features/kyc-airdrop/ui/components/ConnectButtonCustom";
import { RedirectToHomeButton } from "@/features/kyc-airdrop/ui/components/RedirectToHomeButton";
import {
  useCustomerStatus,
  useIsLoading,
  useOpenWidget,
} from "@nexeraid/react-sdk";

const AirdropPageWrapper = () => {
  const router = useRouter();
  const address = router.query.address as Address;

  const {
    balance,
    claimWallet,
    isBalancePending,
    isClaiming,
    isConnected,
    walletClient,
    isQualified,
    allowance,
  } = useWalletCheck();


  const [walletState, setWalletState] = useState<WalletState | undefined>(
    isQualified ? "HAS_ALLOWANCE_CONNECTED" : "IS_NOT_QUALIFIED"
  );


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
      title={
        generateTitleFromWalletState(walletState)
      }
      subtitle={

        generateSubtitleFromWalletState({
          walletState,
          address,
          allowance,
          isCustomerActive,
          isAuthorized: isCustomerActive,
        })
      }
    >

      {renderKycButton()}
      {renderClaimButton()}

      <Button isLoading={true} variant="secondary">
        Loading...
      </Button>
      <RedirectToHomeButton
        variant="primary"
        label="Try another wallet"
      />
      <ConnectButtonCustom
        label="Connect wallet"
        variant="secondary"
      />
      <RedirectToHomeButton />


    </AirdropLayout >
  );
};

const DynamicAirdropPageWrapper = dynamic(
  () => Promise.resolve(AirdropPageWrapper),
  { ssr: false },
);

export default function Airdrop() {
  return <DynamicAirdropPageWrapper />;
}
