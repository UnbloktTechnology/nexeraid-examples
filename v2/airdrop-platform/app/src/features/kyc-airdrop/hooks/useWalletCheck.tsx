import { isAddress, type Address } from "viem";
import { useAccount, useWalletClient, useDisconnect } from "wagmi";
import { useGetTokenBalance } from "@/features/kyc-airdrop/utils/useGetTokenBalance";
import {
  getUserAllowance,
  getUserIndex,
} from "@/features/kyc-airdrop/utils/getUserAllowance";
import { useState } from "react";
import { useRouter } from "next/router";
import { useClaimToken } from "@/features/kyc-airdrop/utils/useClaimToken";
import { z } from "zod";

export const WALLET_STATES = [
  "UNCHECKED",
  "HAS_ALLOWANCE_CONNECTED",
  "HAS_ALLOWANCE_NO_CONNECTED",
  "HAS_NO_ALLOWANCE",
  "IS_NOT_QUALIFIED",
  "ALREADY_CLAIMED",
] as const;
export const WalletState = z.enum(WALLET_STATES);
export type WalletState = z.infer<typeof WalletState>;

export const useWalletCheck = () => {
  const router = useRouter();
  const address = router.query.address as string;
  const { balance, isPending } = useGetTokenBalance();
  const { isConnected } = useAccount();
  const isQualified = getUserIndex(address as Address) !== -1;
  const allowance = getUserAllowance(address as Address);
  const tryClaiming = useClaimToken();
  const { data: walletClient } = useWalletClient();
  const [isClaiming, setIsClaiming] = useState(false);
  const { disconnect } = useDisconnect();

  const claimWallet = () => {
    if (walletClient) {
      setIsClaiming(true);
      tryClaiming
        .mutateAsync()
        .then((_sdkResponse) => {
          setIsClaiming(false);
          console.log("sdkResponse", _sdkResponse.signatureResponse);

          if (_sdkResponse?.signatureResponse.isAuthorized) {
            redirectToClaimSuccess();
          } else {
            redirectToClaimError(
              _sdkResponse?.error ??
              "You are not authorized to claim tokens, please retry the identity verification process",
            );
          }
        })
        .catch((e) => {
          setIsClaiming(false);
          console.error("Error while fetching signature", e);
          redirectToClaimError("Error while fetching signature");
        });
    } else {
      console.log("walletClient not loaded");
    }
  };

  const redirectToClaimSuccess = () => {
    void router.push({
      pathname: "/kyc-airdrop/[address]/success",
      query: { address: router.query.address },
    });
  };

  const redirectToClaimError = (error: string) => {
    void router.push({
      pathname: "/kyc-airdrop/[address]/error",
      query: { address: router.query.address, error },
    });
  };

  const redirectToCheckWallet = (address: Address) => {
    void router.push({
      pathname: "/kyc-airdrop/[address]/check",
      query: {
        address,
      },
    });
  };

  const redirectToHome = () => {
    void router.push({
      pathname: "/kyc-airdrop",
    });
  };

  const isValidAddress = (address: string): boolean => {
    return isAddress(address);
  };

  const handleInvalidInput = (setWalletAddress: (value: string) => void) => {
    alert("Please enter a valid address");
    setWalletAddress("");
  };

  return {
    allowance,
    balance,
    claimWallet,
    disconnectWallet: disconnect,
    handleInvalidInput,
    isBalancePending: isPending,
    isClaiming,
    isConnected,
    isQualified,
    isValidAddress,
    redirectToCheckWallet,
    redirectToHome,
    walletClient,
  };
};

export const generateSubtitleFromWalletState = (
  props?: {
    walletState?: WalletState,
    address?: Address,
    allowance?: number,
    isCustomerActive?: boolean,
    isAuthorized?: boolean,
  }
) => {
  switch (props?.walletState) {
    case "UNCHECKED":
      return "Connect your wallet to claim tokens";
    case "HAS_NO_ALLOWANCE":
      return `Unfortunately, there is no allocation for the wallet ${props.address}`;
    case "IS_NOT_QUALIFIED":
      return `Unfortunately, the wallet ${props.address} doesn't qualify`;
    case "ALREADY_CLAIMED":
      return `Wallet ${props.address} already claimed tokens`;
    case "HAS_ALLOWANCE_CONNECTED":
    case "HAS_ALLOWANCE_NO_CONNECTED":
      if (props.isAuthorized) {
        if (props.isCustomerActive) {
          return "You can claim tokens now";
        }
        return "Now we need to verify your identity before you can claim tokens";
      }
      return `Congrats, the allocation for the wallet ${props.address} is ${props.allowance} PEAQ.`;
    default:
      return "Connect your wallet to claim tokens";
  }
};

export const generateTitleFromWalletState = (walletState?: WalletState) => {
  switch (walletState) {
    case "HAS_NO_ALLOWANCE":
      return "No allocation";
    case "IS_NOT_QUALIFIED":
      return "This wallet doesn't qualify";
    case "ALREADY_CLAIMED":
      return "Tokens were already claimed";
    case "HAS_ALLOWANCE_CONNECTED":
      return "You scored allocation!";
    case "HAS_ALLOWANCE_NO_CONNECTED":
      return "You scored allocation!";
    default:
      return "Let's claim some tokens";
  }
};

export const checkWalletState = (
  props: {
    isQualified: boolean,
    isConnected: boolean,
    balance: number | undefined,
    allowance: number | undefined,
    isBalancePending: boolean,
  }
): WalletState | undefined => {
  const { isQualified, isConnected, balance, allowance, isBalancePending } = props;
  console.log("Checking wallet state...", {
    isConnected,
    isQualified,
    allowance,
    balance,
  });

  if (!isQualified) {
    return "IS_NOT_QUALIFIED";
  }
  if (isConnected) {
    if (allowance) {
      if (balance && balance > 0 && !isBalancePending) {
        return "ALREADY_CLAIMED";
      }
      if (balance === 0 && !isBalancePending) {
        return "HAS_ALLOWANCE_CONNECTED";
      }
    } else {
      return "HAS_NO_ALLOWANCE";
    }
  } else {
    if (allowance) {
      return "HAS_ALLOWANCE_NO_CONNECTED";
    }
    return "HAS_NO_ALLOWANCE";
  }
  return undefined;
};
