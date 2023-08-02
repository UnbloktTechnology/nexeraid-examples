import { Button } from "../Components/Button";
import { IDENTITY_CLIENT } from "@/features/identity/IdentityClient";
import { useKycAuthentication } from "@/features/identity/useKycAuthenticate";

export const IdentityVerifyButton = () => {
  const { accessToken, signingMessage, signature } = useKycAuthentication();
  return <Button id="identity-btn-verify" onClick={() => {
    IDENTITY_CLIENT.startVerification({
      accessToken,
      signingMessage,
      signature,
    });
  }}>Verify</Button>;
};
