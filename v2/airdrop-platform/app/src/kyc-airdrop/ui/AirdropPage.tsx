import { AirdropLayout } from "@/kyc-airdrop/ui/AirdropLayout";
import { Button } from "@/kyc-airdrop/ui/components/Button";
import { useAuthenticate, useOpenWidget } from "@compilot/react-sdk";
import { ConnectWalletButton } from "@/kyc-airdrop/ui/components/ConnectWalletButton";
import { useClaimMutation } from "@/kyc-airdrop/lib/useClaimMutation";
import { useCurrentUiStep } from "@/kyc-airdrop/lib/useUiState";
import { useWalletAddress } from "@/kyc-airdrop/lib/useWalletAddress";
import { SearchBar } from "./components/SearchBar";
import { LogoutButton } from "./components/LogoutButton";
import { useCustomerData } from "../lib/useCustomerData";
import { useSwitchChain } from "wagmi";
import { getDeploymentChain } from "../config/EXAMPLE_AIRDROP_CONTRACT_ADDRESSES";

export const AirdropPage = () => {
  const uiStep = useCurrentUiStep();
  const { isConnected } = useWalletAddress();
  const customerData = useCustomerData();
  const openWidget = useOpenWidget();
  const claimMutation = useClaimMutation();
  const authenticate = useAuthenticate();
  const { switchChain } = useSwitchChain();
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

      {uiStep === "chain_set" && (
        <div className="flex justify-center space-x-4">
          <LogoutButton variant="primary" label="Try another wallet" />
          <Button
            variant="secondary"
            onClick={() => switchChain({ chainId: getDeploymentChain().id })}
          >
            Switch to {getDeploymentChain().name}
          </Button>
        </div>
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
            onClick={() => void openWidget.openWidget()}
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

          {authenticate.data === undefined && (
            <Button variant="secondary" disabled>
              Loading wallet data
            </Button>
          )}

          {authenticate.data === true && (
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

          {authenticate.data === false && (
            <Button
              variant="secondary"
              onClick={() => void authenticate.authenticate()}
              disabled={authenticate.isPending}
              isLoading={authenticate.isPending}
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
