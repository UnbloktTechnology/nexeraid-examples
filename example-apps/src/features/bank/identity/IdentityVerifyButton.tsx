import { Button } from "../Components/Button";
import { IDENTITY_CLIENT } from "@/features/bank/identity/IdentityClient";
import { useBankKycAuthentication } from "./useBankKycAuthenticate";

export const IdentityVerifyButton = () => {
  const { isIdentityClientInit } = useBankKycAuthentication();

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
