import { useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { type Address } from "@nexeraprotocol/identity-schemas";
import {
  getUserAllowance,
  getUserIndex,
} from "@/features/kyc-airdrop/utils/getUserAllowance";
import { useAccount } from "wagmi";
import { useGetTokenBalance } from "../utils/useGetTokenBalance";
import {
  fetchCustomerStatus,
  type CustomerStatusResponse,
} from "@/utils/fetchCustomerStatus";

export enum WalletState {
  HAS_ALLOWANCE = "HAS_ALLOWANCE",
  HAS_NO_ALLOWANCE = "HAS_NO_ALLOWANCE",
  IS_NOT_QUALIFIED = "IS_NOT_QUALIFIED",
  ALREADY_CLAIMED = "ALREADY_CLAIMED",
}

export const useWalletCheck = () => {
  const router = useRouter();
  const { connector } = useAccount();
  const { balance: _balance, isPending: isBalancePending } =
    useGetTokenBalance();

  const balance = useMemo(() => {
    if (_balance && !isBalancePending) {
      console.log("balance found", _balance);
      return _balance;
    }
    return 0;
  }, [_balance, isBalancePending]);

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
        query: { address },
      });
    },
    [router],
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
          console.log("Wallet is qualified");
          if (balance && Number(balance) > 0) {
            console.log("Wallet has balance, it's already claimed");
            onSearchResult(address, WalletState.ALREADY_CLAIMED);
          } else {
            console.log("Wallet has no balance, checking allowance");
            onSearchResult(
              address,
              allowance
                ? WalletState.HAS_ALLOWANCE
                : WalletState.HAS_NO_ALLOWANCE,
            );
          }
        } else {
          console.log("Wallet is not qualified");
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
    });
  };

  const getCustomerStatus = async (
    address: string,
  ): Promise<CustomerStatusResponse> => {
    const response = await fetchCustomerStatus(
      {
        address,
      },
      "kyc-airdrop",
    );
    return response;
  };

  return {
    handleCheck,
    handleInvalidInput,
    isValidAddress,
    WalletState,
    handleTryAnotherWallet,
    handleTryWalletAgain,
    isBalancePending,
    balance,
    getCustomerStatus,
  };
};
