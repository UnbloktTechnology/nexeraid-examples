import { Button } from "../Components/Button";
import { IDENTITY_CLIENT } from "@/features/sygnum-web3/identity/IdentityClient";
import { useKycSygnumWeb3Authentication } from "./useKycSygnumWeb3Authentication";

export const IdentityVerifyButton = () => {
  const { isIdentityClientInit } = useKycSygnumWeb3Authentication();

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
