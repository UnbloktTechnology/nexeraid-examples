import { getUserAirdropAmount, isUserQualified } from "./airdropActions";
import { type Address } from "viem";
import { useAuthenticate } from "@compilot/react-sdk";
import { useWalletAddress } from "./useWalletAddress";
import { useGetTokenBalance } from "./useGetTokenBalance";
import { useRouter } from "next/router";
import { useCustomerData } from "./useCustomerData";
import { useClaimMutation } from "./useClaimMutation";
import { useChainId } from "wagmi";
import { getDeploymentChain } from "../config/EXAMPLE_AIRDROP_CONTRACT_ADDRESSES";

export type UiState = {
  // wallet can be set but not connected as it's present in the url
  wallet: {
    connected: boolean;
    address: Address | undefined;
    chainIsCorrect: boolean;
  };
  route: { check: boolean };
  eligibility: { qualified: boolean };
  kyc: {
    connected: boolean;
    active: boolean;
    failed: boolean;
    processing: boolean;
  };
  claim: { claimed: boolean; claiming: boolean };
};

export const useUiState = (): UiState => {
  const { isConnected, address } = useWalletAddress();
  const customerData = useCustomerData();
  const router = useRouter();
  const { data: isKycAuthenticated } = useAuthenticate();
  const isQualified = address ? isUserQualified(address) : false;
  const { data: balance } = useGetTokenBalance();
  const claimMutation = useClaimMutation();
  const chainId = useChainId();
  const chainIsCorrect = chainId === getDeploymentChain().id;
  const isInCheckPage = router.query.address !== undefined;

  return {
    wallet: { connected: isConnected, address: address, chainIsCorrect },
    route: { check: isInCheckPage },
    eligibility: { qualified: isQualified },
    kyc: {
      connected: isKycAuthenticated === true,
      active: customerData?.data?.userStatus === "Active",
      failed: customerData?.data?.userStatus === "Rejected",
      processing:
        !!customerData?.data?.userStatus &&
        customerData?.data?.userStatus !== "Active",
    },
    claim: {
      claimed: balance ? balance > 0n : false,
      claiming: claimMutation.isPending,
    },
  };
};

export type UiStep =
  | "wallet_set" // we need an address to work with
  | "chain_set" // we need the correct chain
  | "eligibility" // check if the address is qualified
  | "wallet_connect" // connect the wallet if needed
  | "kyc" // ask for kyc
  | "kyc_processing" // kyc is being processed
  | "kyc_failed" // kyc failed
  | "claim" // claim the tokens
  | "done"; // all done

export const useCurrentUiStep = (): UiStep => {
  const uiState = useUiState();

  if (!uiState.wallet.address) return "wallet_set";
  if (!uiState.route.check) return "wallet_set";
  if (!uiState.wallet.chainIsCorrect) return "chain_set";
  if (!uiState.eligibility.qualified) return "eligibility";
  if (!uiState.wallet.connected) return "wallet_connect";
  if (!uiState.kyc.active) {
    if (!uiState.kyc.connected) return "kyc";
    if (uiState.kyc.failed) return "kyc_failed";
    if (uiState.kyc.processing) return "kyc_processing";
  }
  if (!uiState.claim.claimed) return "claim";
  if (uiState.claim.claiming) return "claim";

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

  if (!uiState.route.check)
    return {
      title: "Let's claim some tokens",
      subtitle: "Let's check if you qualify for the airdrop",
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
      subtitle: `Congrats, the allocation for the wallet ${address} is ${allowance} $PEAQ.`,
    };

  if (!uiState.wallet.chainIsCorrect)
    return {
      title: "Wrong chain",
      subtitle: `Please switch to ${getDeploymentChain().name} to claim ${allowance} $PEAQ for ${address}.`,
    };

  if (!uiState.kyc.connected)
    return {
      title: "Let's claim some tokens",
      subtitle: `Now we need to verify your identity before you can claim ${allowance} $PEAQ for ${address}.`,
    };

  if (!uiState.kyc.active && uiState.kyc.failed)
    return {
      title: "Identity verification rejected",
      subtitle:
        "Following the identity verification we determined that you are not allowed to claim the airdrop.",
    };

  if (!uiState.kyc.active)
    return {
      title: "Let's claim some tokens",
      subtitle: `Now we need to verify your identity before you can claim ${allowance} $PEAQ for ${address}.`,
    };

  if (uiState.kyc.processing)
    return {
      title: "Identity verification in progress",
      subtitle: "Please wait while we verify your identity",
    };

  if (!uiState.claim.claimed && isBalanceLoading)
    return {
      title: "Claiming your tokens...",
      subtitle: "Checking wallet balance...",
    };

  if (!uiState.claim.claimed)
    return {
      title: "Let's claim some $PEAQ",
      subtitle: `You can claim ${allowance} $PEAQ now.`,
    };

  return {
    title: "Tokens were already claimed",
    subtitle: `Wallet ${address} already claimed tokens`,
  };
};
