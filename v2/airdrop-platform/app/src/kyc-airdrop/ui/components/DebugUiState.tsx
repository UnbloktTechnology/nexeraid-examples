import { useCustomerData } from "@/kyc-airdrop/lib/useCustomerData";
import { useGetTokenBalance } from "@/kyc-airdrop/lib/useGetTokenBalance";
import { useCurrentUiStep, useUiState } from "@/kyc-airdrop/lib/useUiState";
import { useAuthenticate } from "@compilot/react-sdk";

import { useRouter } from "next/router";
import { useChainId } from "wagmi";

export const DebugUiState = () => {
  const uiState = useUiState();
  const currentStep = useCurrentUiStep();
  const router = useRouter();
  const customerData = useCustomerData();
  const { data: isAuthenticated } = useAuthenticate();
  const chainId = useChainId();
  const debug = router.query.debug === "true";

  const { data: balance, isLoading: isBalanceLoading } = useGetTokenBalance();

  if (!debug) return null;

  return (
    <pre className="text- m-auto text-left">
      {JSON.stringify(
        {
          chainId,
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
