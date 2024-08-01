import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import {
  useWalletCheck,
  WalletState,
} from "@/features/kyc-airdrop/hooks/useWalletCheck";
import { AirdropLayout } from "@/features/kyc-airdrop/ui/AirdropLayout";
import { Button } from "@/features/kyc-airdrop/ui/components/Button";
import { useEffect, useState } from "react";
import { type Address } from "@nexeraid/identity-schemas";
import { useGetCustomerStatusByProjectIdAndWallet } from "@/features/kyc-airdrop/hooks/useGetCustomerStatusByProjectIdAndWallet";
import { SearchBar } from "@/features/kyc-airdrop/ui/components/SearchBar";
import { ConnectButtonCustom } from "@/features/kyc-airdrop/ui/components/ConnectButtonCustom";
import { RedirectToHomeButton } from "@/features/kyc-airdrop/ui/components/RedirectToHomeButton";

const AirdropPageWrapper = () => {
  const router = useRouter();
  const address = router.query.address as Address;
  const [isLoading, setIsLoading] = useState(false);
  const [isCustomerActive, setIsCustomerActive] = useState(false);
  const [walletState, setWalletState] = useState<WalletState>(
    WalletState.UNCHECKED,
  );
  const {
    allowance,
    auth,
    balance,
    claimWallet,
    generateSubtitleFromWalletState,
    generateTitleFromWalletState,
    isAuthenticating,
    isBalancePending,
    isClaiming,
    isConnected,
    isIdentityClientInit,
    isQualified,
    isVerifyingIdentity,
    startVerification,
    walletClient,
    configIdentityClient,
  } = useWalletCheck();

  const customerStatus = useGetCustomerStatusByProjectIdAndWallet(
    address,
    isCustomerActive,
  );
  useEffect(() => {
    setIsCustomerActive(customerStatus.data?.status === "Active");
  }, [customerStatus.data]);

  const onSetWalletState = (state: WalletState) => {
    console.log("Setting wallet state to", state);
    setWalletState(state);
  };

  useEffect(() => {
    console.log("Checking wallet state", {
      isConnected,
      isQualified,
      allowance,
      balance,
      isBalancePending,
    });
    setIsLoading(true);
    if (!isQualified) {
      onSetWalletState(WalletState.IS_NOT_QUALIFIED);
    } else if (isConnected) {
      if (allowance) {
        if (balance && balance > 0 && !isBalancePending) {
          onSetWalletState(WalletState.ALREADY_CLAIMED);
        } else if (balance === 0 && !isBalancePending) {
          onSetWalletState(WalletState.HAS_ALLOWANCE_CONNECTED);
        }
      } else {
        onSetWalletState(WalletState.HAS_NO_ALLOWANCE);
      }
    } else {
      if (allowance) {
        onSetWalletState(WalletState.HAS_ALLOWANCE_NO_CONNECTED);
      } else {
        onSetWalletState(WalletState.HAS_NO_ALLOWANCE);
      }
    }
    setIsLoading(false);
  }, [
    address,
    balance,
    isBalancePending,
    isConnected,
    isQualified,
    allowance,
    walletState,
  ]);

  const renderKycButton = () => {
    return (
      !isCustomerActive && (
        <Button
          variant="secondary"
          onClick={startVerification}
          disabled={isVerifyingIdentity}
          id="identity-btn"
          isLoading={isVerifyingIdentity}
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
    return customerStatus.isLoading ? (
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
              !!auth,
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
                  forceDisconnect={true}
                />
              )}
              {isConnected && !auth && (
                <Button
                  variant="secondary"
                  onClick={() => void configIdentityClient()}
                  isLoading={isAuthenticating}
                >
                  Authenticate wallet to start claiming
                </Button>
              )}
              {isIdentityClientInit &&
                isConnected &&
                auth &&
                renderKycAndClaim()}
            </div>
          )}
          {(walletState === WalletState.ALREADY_CLAIMED ||
            walletState === WalletState.HAS_NO_ALLOWANCE ||
            walletState === WalletState.IS_NOT_QUALIFIED) && (
            <div className="flex w-full flex-col items-center justify-center gap-4">
              {!isConnected && (
                <>
                  <SearchBar />
                  or
                </>
              )}
              <ConnectButtonCustom
                label="Connect the wallet"
                variant="secondary"
              />
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
