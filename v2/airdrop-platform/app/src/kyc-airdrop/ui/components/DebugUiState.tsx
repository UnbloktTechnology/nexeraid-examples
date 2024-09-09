import { useCustomerData } from "@/kyc-airdrop/lib/useCustomerData";
import { useGetTokenBalance } from "@/kyc-airdrop/lib/useGetTokenBalance";
import { useCurrentUiStep, useUiState } from "@/kyc-airdrop/lib/useUiState";

import { useRouter } from "next/router";

export const DebugUiState = () => {
  const uiState = useUiState();
  const currentStep = useCurrentUiStep();
  const router = useRouter();
  const customerData = useCustomerData();
  const debug = router.query.debug === "true";

  const { data: balance, isLoading: isBalanceLoading } = useGetTokenBalance();

  if (!debug) return null;

  return (
    <pre className="m-auto text-left">
      {JSON.stringify(
        {
          currentStep,
          uiState,
          balance: balance?.toString(),
          isBalanceLoading,
          customer: customerData,
        },
        null,
        2,
      )}
    </pre>
  );
};
