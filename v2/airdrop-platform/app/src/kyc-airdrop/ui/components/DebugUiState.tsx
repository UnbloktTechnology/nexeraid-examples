import { useCurrentUiStep, useUiState } from "@/kyc-airdrop/lib/useUiState";
import { useRouter } from "next/router";

export const DebugUiState = () => {
  const uiState = useUiState();
  const currentStep = useCurrentUiStep();
  const router = useRouter();
  const debug = router.query.debug === "true";

  if (!debug) return null;

  return (
    <pre className="m-auto text-left">
      {JSON.stringify({ currentStep, uiState }, null, 2)}
    </pre>
  );
};
