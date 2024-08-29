import { useCurrentUiStep, useUiState } from "@/kyc-airdrop/lib/useUiState";
import { useRouter } from "next/router";

export const DebugUiState = () => {
  // get "?debug=true" query parameter

  const router = useRouter();
  const debug = router.query.debug === "true";

  // get ui state
  const uiState = useUiState();
  const currentStep = useCurrentUiStep();

  // return early if not in debug mode
  if (!debug) return null;

  // render ui state
  return (
    <pre className="m-auto text-left">
      {JSON.stringify({ currentStep, uiState }, null, 2)}
    </pre>
  );
};
