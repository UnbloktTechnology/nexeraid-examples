import { AirdropLayout } from "@/kyc-airdrop/ui/AirdropLayout";
import { Button } from "@/kyc-airdrop/ui/components/Button";
import { useAuthenticate, useOpenWidget } from "@compilot/react-sdk";
import { ConnectWalletButton } from "@/kyc-airdrop/ui/components/ConnectWalletButton";
import { useClaimMutation } from "@/kyc-airdrop/lib/useClaimMutation";
import { useCurrentUiStep } from "@/kyc-airdrop/lib/useUiState";
import { useWalletAddress } from "@/kyc-airdrop/lib/useWalletAddress";
import { AddressSearchBar } from "./components/AddressSearchBar";
import { LogoutButton } from "./components/LogoutButton";
import { useCustomerData } from "../lib/useCustomerData";
import { useSwitchChain } from "wagmi";
import {
  getAirdropTokenConfig,
  getDeploymentChain,
} from "../config/EXAMPLE_AIRDROP_CONTRACT_ADDRESSES";
import { AddTokenButton } from "./components/AddTokenButton";
import { useGetTokenBalance } from "../lib/useGetTokenBalance";
import { formatAirdropTokenAmount } from "../lib/formatDecimalNumber";
import { useRedirectToCheckWallet } from "../lib/navigation";

export const AirdropPage = () => {
  const uiStep = useCurrentUiStep();
  const { isConnected } = useWalletAddress();
  const customerData = useCustomerData();
  const openWidget = useOpenWidget();
  const claimMutation = useClaimMutation();
  const authenticate = useAuthenticate();
  const { switchChain } = useSwitchChain();
  const { data: balance } = useGetTokenBalance();
  const { symbol } = getAirdropTokenConfig();
  const isCustomerActive = customerData.data?.userStatus === "Active";
  const redirectToCheckWallet = useRedirectToCheckWallet();

  return (
    <AirdropLayout>
      {uiStep === "wallet_set" && (
        <>
          {!isConnected && (
            <>
              <AddressSearchBar
                variant="outlined"
                onWalletAddressValid={redirectToCheckWallet}
              />
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
            {authenticate.data === true
              ? "Continue with identity verification"
              : "Begin identity verification"}
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
              Authenticate wallet to start claiming.
            </Button>
          )}
        </div>
      )}

      {uiStep === "done" && (
        <div className="flex flex-col justify-center space-y-4">
          <p>
            You currently own {formatAirdropTokenAmount(balance)} {symbol}
          </p>
          <div className="flex justify-center space-x-4">
            <LogoutButton variant="secondary" label="Use another wallet" />
            <AddTokenButton variant="primary" />
          </div>
        </div>
      )}
    </AirdropLayout>
  );
};
