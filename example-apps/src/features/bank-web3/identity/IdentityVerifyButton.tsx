import { Button } from "../Components/Button";
import { IDENTITY_CLIENT } from "@/features/bank-web3/identity/IdentityClient";
import { useKycBankWeb3Authentication } from "./useKycBankWeb3Authenticate";

export const IdentityVerifyButton = () => {
  const { isIdentityClientInit } = useKycBankWeb3Authentication();

  return !isIdentityClientInit ? (
    "Awaiting identity client initialization..."
  ) : (
    <Button
      id="identity-btn-verify"
      className={`ml-auto px-6 py-4 text-base font-bold text-white`}
      onClick={() => {
        IDENTITY_CLIENT.startVerification();
      }}
      disabled={!isIdentityClientInit}
    >
      Verify
    </Button>
  );
};
