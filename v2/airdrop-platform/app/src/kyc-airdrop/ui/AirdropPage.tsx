import { AirdropLayout } from "@/kyc-airdrop/ui/AirdropLayout";
import { Button } from "@/kyc-airdrop/ui/components/Button";
import { useIsAuthenticated, useOpenWidget } from "@nexeraid/react-sdk";
import { ConnectWalletButton } from "@/kyc-airdrop/ui/components/ConnectWalletButton";
import { useClaimMutation } from "@/kyc-airdrop/lib/useClaimMutation";
import { useCurrentUiStep } from "@/kyc-airdrop/lib/useUiState";
import { useWalletAddress } from "@/kyc-airdrop/lib/useWalletAddress";
import { SearchBar } from "./components/SearchBar";
import { LogoutButton } from "./components/LogoutButton";
import { useCustomerData } from "../lib/useCustomerData";

export const AirdropPage = () => {
  const uiStep = useCurrentUiStep();
  const { isConnected } = useWalletAddress();
  const customerData = useCustomerData();
  const openWidget = useOpenWidget();
  const claimMutation = useClaimMutation();
  const isAuthenticated = useIsAuthenticated();
  const isCustomerActive = customerData.data?.userStatus === "Active";

  return (
    <AirdropLayout>
      {uiStep === "wallet_set" && (
        <>
          {!isConnected && (
            <>
              <SearchBar />
              or
            </>
          )}
          <ConnectWalletButton
            label="Connect your wallet"
            variant="secondary"
          />
        </>
      )}

      {uiStep === "eligibility" && (
        <LogoutButton variant="secondary" label="Try another wallet" />
      )}

      {uiStep === "wallet_connect" && (
        <div className="flex justify-center space-x-4">
          <LogoutButton variant="primary" label="Try another wallet" />
          <ConnectWalletButton
            label="Connect your wallet"
            variant="secondary"
          />
        </div>
      )}

      {uiStep === "kyc" && (
        <div className="flex justify-center space-x-4">
          <LogoutButton variant="primary" label="Try another wallet" />
          <Button
            variant="secondary"
            onClick={() => void openWidget.mutateAsync()}
            disabled={isCustomerActive}
            isLoading={openWidget.isPending}
            id="identity-btn"
          >
            Begin identity verification
          </Button>
        </div>
      )}

      {uiStep === "kyc_processing" && (
        <div className="flex justify-center space-x-4">
          <LogoutButton variant="primary" label="Try another wallet" />
          <Button variant="secondary" disabled>
            Identity verification in progress
          </Button>
        </div>
      )}

      {uiStep === "claim" && (
        <div className="flex justify-center space-x-4">
          <LogoutButton variant="primary" label="Use another wallet" />

          {isAuthenticated.data === undefined && (
            <Button variant="secondary" disabled>
              Loading wallet data
            </Button>
          )}

          {isAuthenticated.data === true && (
            <Button
              variant="secondary"
              disabled={!isCustomerActive || claimMutation.isPending}
              onClick={() => claimMutation.mutate()}
              id="claim-btn"
              isLoading={claimMutation.isPending}
            >
              Claim tokens
            </Button>
          )}

          {isAuthenticated.data === false && (
            <Button
              variant="secondary"
              onClick={() => void openWidget.mutateAsync()}
              disabled={openWidget.isPending}
              isLoading={openWidget.isPending}
              id="identity-btn"
            >
              Authenticate wallet to claim
            </Button>
          )}
        </div>
      )}
    </AirdropLayout>
  );
};
