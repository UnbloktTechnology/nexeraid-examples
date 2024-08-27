import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import {
  useWalletCheck,
  WalletState,
} from "@/features/kyc-airdrop/hooks/useWalletCheck";
import { AirdropLayout } from "@/features/kyc-airdrop/ui/AirdropLayout";
import { Button } from "@/features/kyc-airdrop/ui/components/Button";
import { useCallback, useEffect, useState } from "react";
import { type Address } from "@nexeraid/identity-schemas";
import { ConnectButtonCustom } from "@/features/kyc-airdrop/ui/components/ConnectButtonCustom";
import { RedirectToHomeButton } from "@/features/kyc-airdrop/ui/components/RedirectToHomeButton";
import { useUserStatus, useOpenWidget, useIsLoading } from "@nexeraid/react-sdk";

const AirdropPageWrapper = () => {
  const router = useRouter();
  const address = router.query.address as Address;
  const [isLoading, setIsLoading] = useState(true);
  const [walletChecked, setWalletChecked] = useState(false);
  const [walletState, setWalletState] = useState<WalletState | undefined>();
  const [balanceChecked, setBalanceChecked] = useState(false);

  const {
    balance,
    checkWalletState,
    claimWallet,
    generateSubtitleFromWalletState,
    generateTitleFromWalletState,
    isBalancePending,
    isClaiming,
    isConnected,
    walletClient,
    isQualified,
    allowance,
  } = useWalletCheck();

  const customerStatus = useUserStatus();
  const openWidget = useOpenWidget({});
  const isWidgetLoading = useIsLoading();
  const isCustomerActive = customerStatus === "Active";

  const onSetWalletState = useCallback((state: WalletState | undefined) => {
    setWalletState(state);
    setWalletChecked(true);
    console.log("Wallet state set", state);
  }, []);

  // Check wallet state when wallet connects or balance changes
  useEffect(() => {
    // If wallet is connected, check the balance
    if (isConnected) {
      setBalanceChecked(!isBalancePending && balance !== undefined);
    } else {
      setBalanceChecked(true); // If not connected, no need to check balance
    }

    // Check the wallet state if balance is checked
    if (balanceChecked && !walletChecked) {
      onSetWalletState(
        checkWalletState(
          isQualified,
          isConnected,
          balance,
          allowance,
          isBalancePending,
        ),
      );
    }

    if (walletChecked && balanceChecked) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [
    balance,
    isBalancePending,
    isConnected,
    isQualified,
    allowance,
    walletState,
    checkWalletState,
    onSetWalletState,
    walletChecked,
    balanceChecked,
  ]);

  // Recalculate the wallet state when the connection status changes
  useEffect(() => {
    if (isConnected) {
      setWalletChecked(false);
      setBalanceChecked(false);
      setIsLoading(true);
    }
  }, [isConnected]);

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

  const renderKycAndClaim = () => {
    return !customerStatus ? (
      <Button variant="secondary" isLoading>
        Please wait
      </Button>
    ) : (
      <>
        {renderKycButton()}
        {renderClaimButton()}
      </>
    );
  };

  return (
    <AirdropLayout
      title={
        isLoading ? "Please wait" : generateTitleFromWalletState(walletState)
      }
      subtitle={
        isLoading
          ? "We are checking your wallet..."
          : generateSubtitleFromWalletState(
            walletState,
            address,
            allowance,
            isCustomerActive,
          )
      }
    >
      {isLoading && (
        <Button isLoading={true} variant="secondary">
          Loading...
        </Button>
      )}
      {!isLoading && (
        <>
          {(walletState === WalletState.HAS_ALLOWANCE_CONNECTED ||
            walletState === WalletState.HAS_ALLOWANCE_NO_CONNECTED) && (
              <div className="flex flex-row items-center justify-center gap-4">
                <RedirectToHomeButton
                  variant="primary"
                  label="Try another wallet"
                />

                {!isConnected && (
                  <ConnectButtonCustom
                    label="Connect wallet"
                    variant="secondary"
                  />
                )}
                {
                  isConnected &&
                  renderKycAndClaim()}
              </div>
            )}
          {(walletState === WalletState.ALREADY_CLAIMED ||
            walletState === WalletState.HAS_NO_ALLOWANCE ||
            walletState === WalletState.IS_NOT_QUALIFIED) && (
              <div className="flex w-full flex-col items-center justify-center gap-4">
                <RedirectToHomeButton />
              </div>
            )}
        </>
      )}
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
