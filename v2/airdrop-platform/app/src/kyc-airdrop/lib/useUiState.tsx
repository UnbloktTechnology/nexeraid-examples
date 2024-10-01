import { getUserAirdropAmount, isUserQualified } from "./airdropActions";
import { UserRejectedRequestError, type Address } from "viem";
import { useAuthenticate } from "@compilot/react-sdk";
import { useWalletAddress } from "./useWalletAddress";
import { useGetTokenBalance } from "./useGetTokenBalance";
import { useRouter } from "next/router";
import { useCustomerData } from "./useCustomerData";
import { useClaimMutation } from "./useClaimMutation";
import { useChainId } from "wagmi";
import {
  getAirdropTokenConfig,
  getDeploymentChain,
} from "../config/EXAMPLE_AIRDROP_CONTRACT_ADDRESSES";
import { formatAirdropTokenAmount } from "./formatDecimalNumber";
import { AirdropTokenIcon } from "../ui/components/icon/AirdropTokenIcon";
import { ChainIcon } from "../ui/components/icon/ChainIcon";
import { formatAddress } from "./formatAddress";

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
  claim: { claimed: boolean; claiming: boolean; rejected: boolean };
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
      failed:
        customerData?.data?.userStatus === "Rejected" ||
        customerData?.data?.userStatus === "Failed",
      processing:
        !!customerData?.data?.userStatus &&
        customerData?.data?.userStatus !== "Active",
    },
    claim: {
      claimed: balance ? balance > 0n : false,
      rejected: claimMutation.data instanceof UserRejectedRequestError,
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
    if (uiState.kyc.failed) return "kyc_failed";
    if (uiState.kyc.processing) return "kyc_processing";
    return "kyc";
  }
  if (!uiState.claim.claimed) return "claim";
  if (uiState.claim.claiming) return "claim";

  return "done";
};

export const useTitles = (): {
  title: React.ReactNode;
  subtitle: React.ReactNode;
} => {
  const uiState = useUiState();
  const { address } = useWalletAddress();
  const allowance = address ? getUserAirdropAmount(address) : 0n;
  const { isLoading: isBalanceLoading } = useGetTokenBalance();
  const { symbol } = getAirdropTokenConfig();
  const chainId = useChainId();

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
      subtitle: (
        <>
          Unfortunately, the wallet <ChainIcon chainId={chainId} />{" "}
          {formatAddress(address)} doesn&apos;t qualify
        </>
      ),
    };

  if (!allowance)
    return {
      title: "No allocation",
      subtitle: (
        <>
          Unfortunately, there is no allocation for the wallet{" "}
          <ChainIcon chainId={chainId} /> {formatAddress(address)}
        </>
      ),
    };

  if (!uiState.wallet.connected)
    return {
      title: "You scored allocation!",
      subtitle: (
        <>
          Congrats, the allocation for the wallet{" "}
          <ChainIcon chainId={chainId} /> {formatAddress(address)} is{" "}
          <AirdropTokenIcon /> {formatAirdropTokenAmount(allowance)} ${symbol}.
        </>
      ),
    };

  if (!uiState.wallet.chainIsCorrect)
    return {
      title: "Wrong chain",
      subtitle: (
        <>
          Please switch to {getDeploymentChain().name} to claim{" "}
          <AirdropTokenIcon /> {formatAirdropTokenAmount(allowance)} ${symbol}{" "}
          for <ChainIcon chainId={chainId} /> {formatAddress(address)}.
        </>
      ),
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
      subtitle: (
        <>
          Now we need to verify your identity before you can claim{" "}
          <AirdropTokenIcon /> {formatAirdropTokenAmount(allowance)} {symbol}{" "}
          for <ChainIcon chainId={chainId} /> {formatAddress(address)}.
        </>
      ),
    };

  if (uiState.kyc.processing)
    return {
      title: "Identity verification in progress",
      subtitle: "Please wait while we verify your identity",
    };

  if (uiState.claim.claimed)
    return {
      title: "Airdrop already claimed",
      subtitle: (
        <>
          Congratulations you already claimed your airdrop for the wallet{" "}
          <ChainIcon chainId={chainId} /> {formatAddress(address)}
        </>
      ),
    };

  if (!uiState.kyc.connected)
    return {
      title: "You scored allocation!",
      subtitle: (
        <>
          Congrats, the allocation for the wallet{" "}
          <ChainIcon chainId={chainId} /> {formatAddress(address)} is{" "}
          <AirdropTokenIcon /> {formatAirdropTokenAmount(allowance)} ${symbol}.
        </>
      ),
    };

  if (!uiState.claim.claimed && isBalanceLoading)
    return {
      title: "Claiming your tokens...",
      subtitle: "Checking wallet balance...",
    };

  if (!uiState.claim.claimed)
    return {
      title: `Let's claim some $${symbol}`,
      subtitle: `You can claim ${formatAirdropTokenAmount(allowance)} $${symbol} now.`,
    };

  return {
    title: "Tokens were already claimed",
    subtitle: (
      <>
        Congratulations you already claimed your airdrop for the wallet{" "}
        <ChainIcon chainId={chainId} /> {formatAddress(address)}
      </>
    ),
  };
};
