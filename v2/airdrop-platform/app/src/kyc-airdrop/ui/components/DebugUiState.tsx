import { useCustomerData } from "@/kyc-airdrop/lib/useCustomerData";
import { useGetTokenBalance } from "@/kyc-airdrop/lib/useGetTokenBalance";
import { useCurrentUiStep, useUiState } from "@/kyc-airdrop/lib/useUiState";
import { useIsAuthenticated } from "@nexeraid/react-sdk";

import { useRouter } from "next/router";

export const DebugUiState = () => {
  const uiState = useUiState();
  const currentStep = useCurrentUiStep();
  const router = useRouter();
  const customerData = useCustomerData();
  const isAuthenticated = useIsAuthenticated();
  const debug = router.query.debug === "true";

  const { data: balance, isLoading: isBalanceLoading } = useGetTokenBalance();

  if (!debug) return null;

  return (
    <pre className="text- m-auto text-left">
      {JSON.stringify(
        {
          currentStep,
          uiState,
          isAuthenticated,
          balance: balance?.toString(),
          isBalanceLoading,
          customer: customerData.data,
        },
        null,
        2,
      )}
    </pre>
  );
};
