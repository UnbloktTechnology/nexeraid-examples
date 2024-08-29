import { useRouter } from "next/router";
import { useCallback } from "react";
import { type Address } from "viem";
import { useIsDebugMode } from "./useIsDebugMode";

export const useRedirectToClaimSuccess = () => {
  const router = useRouter();
  const isDebugMode = useIsDebugMode();

  return useCallback(
    (address: Address) => {
      void router.push({
        pathname: "/[address]/success",
        query: { address, debug: isDebugMode ? "true" : undefined },
      });
    },
    [router, isDebugMode],
  );
};

export const useRedirectToClaimError = () => {
  const router = useRouter();
  const isDebugMode = useIsDebugMode();

  return useCallback(
    (address: Address, error: string) => {
      void router.push({
        pathname: "/[address]/error",
        query: { address, error, debug: isDebugMode ? "true" : undefined },
      });
    },
    [router, isDebugMode],
  );
};

export const useRedirectToCheckWallet = () => {
  const router = useRouter();
  const isDebugMode = useIsDebugMode();

  return useCallback(
    (address: Address) => {
      void router.push({
        pathname: "/[address]/check",
        query: {
          address,
          debug: isDebugMode ? "true" : undefined,
        },
      });
    },
    [router, isDebugMode],
  );
};

export const useRedirectToHome = () => {
  const router = useRouter();
  const isDebugMode = useIsDebugMode();

  return useCallback(() => {
    void router.push({
      pathname: "/",
      query: {
        debug: isDebugMode ? "true" : undefined,
      },
    });
  }, [router, isDebugMode]);
};
