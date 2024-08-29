import { getUserAirdropAmount, isUserQualified } from "./airdropActions";
import { type Address } from "viem";
import { useCustomerStatus, useIsAuthenticated } from "@nexeraid/react-sdk";
import { useWalletAddress } from "./useWalletAddress";
import { useGetTokenBalance } from "./useGetTokenBalance";

export type UiState = {
  // wallet can be set but not connected as it's present in the url
  wallet: { connected: boolean; address: Address | undefined };
  eligibility: { qualified: boolean };
  kyc: { connected: true; active: boolean } | { connected: false };
  claim: { claimed: boolean };
};

export const useUiState = (): UiState => {
  const { isConnected, address } = useWalletAddress();
  const customerStatus = useCustomerStatus();
  const isKycAuthenticated = useIsAuthenticated();
  const isQualified = address ? isUserQualified(address) : false;
  const { data: balance } = useGetTokenBalance();

  return {
    wallet: { connected: isConnected, address: address },
    eligibility: { qualified: isQualified },
    kyc: isKycAuthenticated
      ? { connected: true, active: customerStatus === "Active" }
      : { connected: false },
    claim: { claimed: balance ? balance > 0n : false },
  };
};

export type UiStep =
  | "wallet_set" // we need an address to work with
  | "eligibility" // check if the address is qualified
  | "wallet_connect" // connect the wallet if needed
  | "kyc" // ask for kyc
  | "claim" // claim the tokens
  | "done"; // all done

export const useCurrentUiStep = (): UiStep => {
  const uiState = useUiState();

  if (!uiState.wallet.address) return "wallet_set";
  if (!uiState.eligibility.qualified) return "eligibility";
  if (!uiState.wallet.connected) return "wallet_connect";
  if (!uiState.kyc.connected || !uiState.kyc.active) return "kyc";
  if (!uiState.claim.claimed) return "claim";

  return "done";
};

export const useTitles = (): { title: string; subtitle: string } => {
  const uiState = useUiState();
  const { address } = useWalletAddress();
  const allowance = address ? getUserAirdropAmount(address) : 0n;
  const { isLoading: isBalanceLoading } = useGetTokenBalance();

  if (!uiState.wallet.address)
    return {
      title: "Let's claim some tokens",
      subtitle: "Connect your wallet to claim tokens",
    };

  if (!uiState.eligibility.qualified)
    return {
      title: "This wallet doesn't qualify",
      subtitle: `Unfortunately, the wallet ${address} doesn't qualify`,
    };

  if (!allowance)
    return {
      title: "No allocation",
      subtitle: `Unfortunately, there is no allocation for the wallet ${address}`,
    };

  if (!uiState.wallet.connected)
    return {
      title: "You scored allocation!",
      subtitle: `Congrats, the allocation for the wallet ${address} is ${allowance} PEAQ.`,
    };

  if (!uiState.kyc.connected || !uiState.kyc.active)
    return {
      title: "Let's claim some tokens",
      subtitle:
        "Now we need to verify your identity before you can claim tokens",
    };

  if (!uiState.claim.claimed && isBalanceLoading)
    return {
      title: "Claiming your tokens...",
      subtitle: "Checking wallet balance...",
    };

  if (!uiState.claim.claimed)
    return {
      title: "You scored allocation!",
      subtitle: "You can claim tokens now",
    };

  return {
    title: "Tokens were already claimed",
    subtitle: `Wallet ${address} already claimed tokens`,
  };
};
