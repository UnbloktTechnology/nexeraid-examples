import type { Address } from "@nexeraid/identity-schemas";
import { useAccount, useWalletClient, useDisconnect } from "wagmi";
import { useGetTokenBalance } from "@/features/kyc-airdrop/utils/useGetTokenBalance";
import {
  getUserAllowance,
  getUserIndex,
} from "@/features/kyc-airdrop/utils/getUserAllowance";
import { useState } from "react";
import { useRouter } from "next/router";
import { useClaimToken } from "@/features/kyc-airdrop/utils/useClaimToken";

export enum WalletState {
  UNCHECKED = "UNCHECKED",
  HAS_ALLOWANCE_CONNECTED = "HAS_ALLOWANCE_CONNECTED",
  HAS_ALLOWANCE_NO_CONNECTED = "HAS_ALLOWANCE_NO_CONNECTED",
  HAS_NO_ALLOWANCE = "HAS_NO_ALLOWANCE",
  IS_NOT_QUALIFIED = "IS_NOT_QUALIFIED",
  ALREADY_CLAIMED = "ALREADY_CLAIMED",
}

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
    const regex = /^0x[a-fA-F0-9]{40}$/;
    return regex.test(address);
  };

  const handleInvalidInput = (setWalletAddress: (value: string) => void) => {
    alert("Please enter a valid address");
    setWalletAddress("");
  };

  const disconnectWallet = () => {
    disconnect();
  };

  const generateTitleFromWalletState = (walletState?: WalletState) => {
    switch (walletState) {
      case WalletState.HAS_NO_ALLOWANCE:
        return "No allocation";
      case WalletState.IS_NOT_QUALIFIED:
        return "This wallet doesn't qualify";
      case WalletState.ALREADY_CLAIMED:
        return "Tokens were already claimed";
      case WalletState.HAS_ALLOWANCE_CONNECTED:
        return "You scored allocation!";
      case WalletState.HAS_ALLOWANCE_NO_CONNECTED:
        return "You scored allocation!";
      default:
        return "Let's claim some tokens";
    }
  };

  const generateSubtitleFromWalletState = (
    walletState?: WalletState,
    address?: Address,
    allowance?: number,
    isCustomerActive?: boolean,
    isAuthorized?: boolean,
  ) => {
    switch (walletState) {
      case WalletState.HAS_NO_ALLOWANCE:
        return `Unfortunately, there is no allocation for the wallet ${address}`;
      case WalletState.IS_NOT_QUALIFIED:
        return `Unfortunately, the wallet ${address} doesn't qualify`;
      case WalletState.ALREADY_CLAIMED:
        return `Wallet ${address} already claimed tokens`;
      case WalletState.HAS_ALLOWANCE_CONNECTED:
      case WalletState.HAS_ALLOWANCE_NO_CONNECTED:
        if (isAuthorized) {
          if (isCustomerActive) {
            return "You can claim tokens now";
          }
          return "Now we need to verify your identity before you can claim tokens";
        }
        return `Congrats, the allocation for the wallet ${address} is ${allowance} PEAQ.`;
      default:
        return "Connect your wallet to claim tokens";
    }
  };

  const checkWalletState = (
    isQualified: boolean,
    isConnected: boolean,
    balance: number | undefined,
    allowance: number | undefined,
    isBalancePending: boolean,
  ): WalletState | undefined => {
    console.log("Checking wallet state...", {
      isConnected,
      isQualified,
      allowance,
      balance,
    });

    if (!isQualified) {
      return WalletState.IS_NOT_QUALIFIED;
    }
    if (isConnected) {
      if (allowance) {
        if (balance && balance > 0 && !isBalancePending) {
          return WalletState.ALREADY_CLAIMED;
        }
        if (balance === 0 && !isBalancePending) {
          return WalletState.HAS_ALLOWANCE_CONNECTED;
        }
      } else {
        return WalletState.HAS_NO_ALLOWANCE;
      }
    } else {
      if (allowance) {
        return WalletState.HAS_ALLOWANCE_NO_CONNECTED;
      }
      return WalletState.HAS_NO_ALLOWANCE;
    }
    return undefined;
  };

  return {
    allowance,
    balance,
    checkWalletState,
    claimWallet,
    disconnectWallet,
    generateSubtitleFromWalletState,
    generateTitleFromWalletState,
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
