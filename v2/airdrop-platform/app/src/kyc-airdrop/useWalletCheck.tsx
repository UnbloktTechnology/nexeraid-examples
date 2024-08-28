import { isAddress, type Address } from "viem";
import { useAccount, useWalletClient, useDisconnect, useChainId } from "wagmi";
import { useGetTokenBalance } from "./useGetTokenBalance";
import {
  claimToken,
  getUserAirdropAmount,
  getUserIndex,
} from "./airdropActions";
import { useRouter } from "next/router";
import { z } from "zod";
import { useMutation } from '@tanstack/react-query';
import { EvmChainId } from "@nexeraid/react-sdk";

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
  const chainId = useChainId();
  const { isConnected, address: accountAddress } = useAccount();
  const isQualified = getUserIndex(address as Address) !== -1;
  const allowance = getUserAirdropAmount(address as Address);

  const { data: walletClient } = useWalletClient();
  const { disconnect } = useDisconnect();

  const claimMutation = useMutation({
    mutationFn: async () => {
      if (!accountAddress || !chainId) {
        throw new Error("No account in wallet Client - address" + accountAddress + " chainId" + chainId);
      }
      const parsedChainId = EvmChainId.parse(chainId);
      const result = await claimToken({
        userAddress: accountAddress,
        chainId: parsedChainId,
      });
      return result;
    },
    onSuccess: (sdkResponse) => {
      console.log("sdkResponse", sdkResponse.signatureResponse);
      if (sdkResponse?.signatureResponse.isAuthorized) {
        return redirectToClaimSuccess();
      }
      return redirectToClaimError("You are not authorized to claim tokens, please retry the identity verification process");
    },
    onError: (error) => {
      console.error("Error while fetching signature", error);
      redirectToClaimError("Error while fetching signature");
    },
  });

  const claimWallet = () => {
    claimMutation.mutate();
  };

  const redirectToClaimSuccess = () => {
    void router.push({
      pathname: "/[address]/success",
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
      pathname: "/[address]/check",
      query: {
        address,
      },
    });
  };

  const redirectToHome = () => {
    void router.push({
      pathname: "/",
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
    isClaiming: claimMutation.isPending,
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
      if (!props.isAuthorized && !props.isCustomerActive)
        return `Congrats, the allocation for the wallet ${props.address} is ${props.allowance} PEAQ.`;
      if (props.isAuthorized && !props.isCustomerActive)
        return `Now we need to verify your identity before you can claim tokens`;
      if (props.isAuthorized && props.isCustomerActive)
        return `You can claim tokens now`;
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

export const checkWalletState = (props: {
  isQualified: boolean,
  isConnected: boolean,
  balance: number | undefined,
  allowance: number | undefined,
  isBalancePending: boolean,
}): WalletState => {


  if (!props.isQualified) return "IS_NOT_QUALIFIED";
  if (!props.allowance) return "HAS_NO_ALLOWANCE";
  if (!props.isConnected) return "HAS_ALLOWANCE_NO_CONNECTED";
  if (props.balance === undefined || props.isBalancePending) return "UNCHECKED";
  if (props.balance > 0) return "ALREADY_CLAIMED";
  return "HAS_ALLOWANCE_CONNECTED";
};
