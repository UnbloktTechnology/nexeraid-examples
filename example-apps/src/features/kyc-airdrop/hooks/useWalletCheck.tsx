import { useCallback } from "react";
import { useRouter } from "next/router";
import { type Address } from "@nexeraid/identity-schemas";
import {
  getUserAllowance,
  getUserIndex,
} from "@/features/kyc-airdrop/utils/getUserAllowance";
import { useAccount } from "wagmi";
import { useGetTokenBalance } from "../utils/useGetTokenBalance";

export enum WalletState {
  HAS_ALLOWANCE = "HAS_ALLOWANCE",
  HAS_NO_ALLOWANCE = "HAS_NO_ALLOWANCE",
  IS_NOT_QUALIFIED = "IS_NOT_QUALIFIED",
  ALREADY_CLAIMED = "ALREADY_CLAIMED",
}

export const useWalletCheck = () => {
  const router = useRouter();
  const { connector } = useAccount();
  const { balance, isPending: isBalancePending } = useGetTokenBalance();

  const isValidAddress = (address: string): boolean => {
    const regex = /^0x[a-fA-F0-9]{40}$/;
    return regex.test(address);
  };

  const handleInvalidInput = (setWalletAddress: (value: string) => void) => {
    alert("Please enter a valid address");
    setWalletAddress("");
  };

  const handleAllocationCheck = useCallback(
    (address: Address) => {
      void router.push({
        pathname: "/kyc-airdrop/[address]/allocation-check",
        query: { address, balance },
      });
    },
    [router, balance],
  );

  const handleNoAllowance = useCallback(
    (address: Address) => {
      void router.push({
        pathname: "/kyc-airdrop/[address]/no-allowance",
        query: { address },
      });
    },
    [router],
  );

  const handleNotQualified = useCallback(
    (address: Address) => {
      void router.push({
        pathname: "/kyc-airdrop/[address]/not-qualified",
        query: { address },
      });
    },
    [router],
  );

  const handleAlreadyClaimed = useCallback(
    (address: Address) => {
      void router.push({
        pathname: "/kyc-airdrop/[address]/already-claimed",
        query: { address },
      });
    },
    [router],
  );

  const handleTryWalletAgain = (address: Address) => {
    void router.push({
      pathname: "/kyc-airdrop/[address]/claim-tokens",
      query: { address },
    });
  };

  const onSearchResult = useCallback(
    (address: Address, walletState: WalletState) => {
      switch (walletState) {
        case WalletState.HAS_ALLOWANCE:
          handleAllocationCheck(address);
          break;
        case WalletState.HAS_NO_ALLOWANCE:
          handleNoAllowance(address);
          break;
        case WalletState.IS_NOT_QUALIFIED:
          handleNotQualified(address);
          break;
        case WalletState.ALREADY_CLAIMED:
          handleAlreadyClaimed(address);
          break;
      }
    },
    [
      handleAllocationCheck,
      handleNoAllowance,
      handleNotQualified,
      handleAlreadyClaimed,
    ],
  );

  const handleCheck = useCallback(
    (address: Address, setWalletAddress: (value: string) => void) => {
      if (isValidAddress(address)) {
        const isQualified = getUserIndex(address) !== -1;
        const allowance = isQualified ? getUserAllowance(address) : undefined;

        if (isQualified) {
          console.log("balance", balance);
          if (balance && Number(balance) > 0) {
            onSearchResult(address, WalletState.ALREADY_CLAIMED);
          } else {
            onSearchResult(
              address,
              allowance
                ? WalletState.HAS_ALLOWANCE
                : WalletState.HAS_NO_ALLOWANCE,
            );
          }
        } else {
          onSearchResult(address, WalletState.IS_NOT_QUALIFIED);
        }
      } else if (address.length === 42) {
        handleInvalidInput(setWalletAddress);
      }
    },
    [balance, onSearchResult],
  );

  const handleTryAnotherWallet = async () => {
    await connector?.disconnect();
    void router.push({
      pathname: "/kyc-airdrop",
      query: {
        reset: true,
      },
    });
  };

  return {
    handleCheck,
    handleInvalidInput,
    isValidAddress,
    WalletState,
    handleTryAnotherWallet,
    handleTryWalletAgain,
    isBalancePending,
  };
};
