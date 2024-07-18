import { useCallback } from "react";
import { useRouter } from "next/router";
import { type Address } from "@nexeraprotocol/identity-schemas";
import {
  getUserAllowance,
  getUserIndex,
} from "@/features/kyc-airdrop/utils/getUserAllowance";

export enum WalletState {
  HAS_ALLOWANCE = "HAS_ALLOWANCE",
  HAS_NO_ALLOWANCE = "HAS_NO_ALLOWANCE",
  IS_NOT_QUALIFIED = "IS_NOT_QUALIFIED",
}

export const useWalletCheck = () => {
  const router = useRouter();

  const isValidAddress = (address: string): boolean => {
    const regex = /^0x[a-fA-F0-9]{40}$/;
    return regex.test(address);
  };

  const handleInvalidInput = (setWalletAddress: (value: string) => void) => {
    alert("Please enter a valid address");
    setWalletAddress("");
  };

  const handleCheck = useCallback(
    (address: Address, setWalletAddress: (value: string) => void) => {
      if (isValidAddress(address)) {
        const isQualified = getUserIndex(address) !== -1;
        const allowance = isQualified ? getUserAllowance(address) : undefined;

        if (isQualified) {
          onSearchResult(
            address,
            allowance
              ? WalletState.HAS_ALLOWANCE
              : WalletState.HAS_NO_ALLOWANCE,
          );
        } else {
          onSearchResult(address, WalletState.IS_NOT_QUALIFIED);
        }
      } else if (address.length === 42) {
        handleInvalidInput(setWalletAddress);
      }
    },
    [],
  );

  const handleAllocationCheck = (address: Address) => {
    void router.push({
      pathname: "/kyc-airdrop/[address]/allocation-check",
      query: { address },
    });
  };

  const handleNoAllowance = (address: Address) => {
    void router.push({
      pathname: "/kyc-airdrop/[address]/no-allowance",
      query: { address },
    });
  };

  const handleNotQualified = (address: Address) => {
    void router.push({
      pathname: "/kyc-airdrop/[address]/not-qualified",
      query: { address },
    });
  };

  const onSearchResult = (address: Address, walletState: WalletState) => {
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
    }
  };

  return { handleCheck, handleInvalidInput, isValidAddress, WalletState };
};
