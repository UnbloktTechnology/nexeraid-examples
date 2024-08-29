import { AirdropLayout } from "@/kyc-airdrop/ui/AirdropLayout";
import { Button } from "@/kyc-airdrop/ui/components/Button";
import {
  useCustomerStatus,
  useIsLoading,
  useOpenWidget,
} from "@nexeraid/react-sdk";
import { ConnectWalletButton } from "@/kyc-airdrop/ui/components/ConnectWalletButton";
import { useClaimMutation } from "@/kyc-airdrop/lib/useClaimMutation";
import { useCurrentUiStep } from "@/kyc-airdrop/lib/useUiState";
import { useWalletAddress } from "@/kyc-airdrop/lib/useWalletAddress";
import { SearchBar } from "./components/SearchBar";
import { LogoutButton } from "./components/LogoutButton";

export const AirdropPage = () => {
  const uiStep = useCurrentUiStep();
  const { isConnected } = useWalletAddress();
  const customerStatus = useCustomerStatus();
  const openWidget = useOpenWidget({});
  const isWidgetLoading = useIsLoading();
  const claimMutation = useClaimMutation();

  const isCustomerActive = customerStatus === "Active";

  return (
    <AirdropLayout>
      {(uiStep === "wallet_set" || uiStep === "wallet_connect") && (
        <>
          {!isConnected && (
            <>
              <SearchBar />
              or
            </>
          )}
          <ConnectWalletButton label="Connect wallet" variant="secondary" />
        </>
      )}

      {uiStep === "kyc" && (
        <Button
          variant="secondary"
          onClick={openWidget}
          disabled={!isCustomerActive || isWidgetLoading}
          id="identity-btn"
          isLoading={isWidgetLoading}
        >
          Begin identity verification
        </Button>
      )}

      {uiStep === "claim" && (
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

      {isConnected && (
        <LogoutButton variant="primary" label="Try another wallet" />
      )}
    </AirdropLayout>
  );
};
