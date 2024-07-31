import { Button } from "../Components/Button";
import { IDENTITY_CLIENT } from "@/features/bank-kyb/identity/IdentityClient";
import { useBankKYBAuthentication } from "./useBankKYBAuthenticate";

export const IdentityVerifyButton = () => {
  const { isIdentityClientInit } = useBankKYBAuthentication();

  return !isIdentityClientInit ? (
    "Awaiting identity client initialization..."
  ) : (
    <Button
      id="identity-btn-verify"
      className={`ml-auto px-6 py-4 text-base font-bold text-white`}
      onClick={() => {
        IDENTITY_CLIENT.startKYB();
      }}
      disabled={!isIdentityClientInit}
    >
      Verify
    </Button>
  );
};
