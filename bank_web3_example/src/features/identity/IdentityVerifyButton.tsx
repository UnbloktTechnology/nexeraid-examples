import { Button } from "../Components/Button";
import { IDENTITY_CLIENT } from "@/features/identity/IdentityClient";
import { useKycAuthentication } from "@/features/identity/useKycAuthenticate";

export const IdentityVerifyButton = () => {
  const { accessToken, signingMessage, signature } = useKycAuthentication();
  return (
    <Button
      id="identity-btn-verify"
      className={`ml-auto px-6 py-4 text-base font-bold text-white`}
      onClick={() => {
        IDENTITY_CLIENT.startVerification({
          accessToken: accessToken as string,
          signingMessage: signingMessage as string,
          signature: signature as string,
        });
      }}
    >
      Verify
    </Button>
  );
};
