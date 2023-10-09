import { Button } from "../Components/Button";
import { IDENTITY_CLIENT } from "@/features/bank/identity/IdentityClient";

export const IdentityVerifyButton = () => {
  return (
    <Button
      id="identity-btn-verify"
      onClick={() => {
        IDENTITY_CLIENT.startVerification();
      }}
    >
      Verify
    </Button>
  );
};
