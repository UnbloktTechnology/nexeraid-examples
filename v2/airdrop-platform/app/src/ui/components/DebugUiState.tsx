import { useClaimMutation } from "@/kyc-airdrop/lib/useClaimMutation";
import { useCustomerData } from "@/kyc-airdrop/lib/useCustomerData";
import { useGetTokenBalance } from "@/kyc-airdrop/lib/useGetTokenBalance";
import {
  useCurrentUiStep,
  useClaimUiState,
} from "@/kyc-airdrop/lib/useClaimUiState";
import { useAuthenticate } from "@compilot/react-sdk";

import { useRouter } from "next/router";
import { useChainId } from "wagmi";

export const DebugUiState = () => {
  const uiState = useClaimUiState();
  const currentStep = useCurrentUiStep();
  const router = useRouter();
  const customerQuery = useCustomerData();
  const { data: isAuthenticated } = useAuthenticate();
  const chainId = useChainId();
  const debug = router.query.debug === "true";
  const claimMutation = useClaimMutation();

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
          customerQuery,
          claimMutation,
        },
        null,
        2,
      )}
    </pre>
  );
};
