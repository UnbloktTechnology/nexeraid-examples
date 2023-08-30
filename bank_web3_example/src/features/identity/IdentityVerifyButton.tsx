import { Button } from "../Components/Button";
import { IDENTITY_CLIENT } from "@/features/identity/IdentityClient";

export const IdentityVerifyButton = () => {
  return (
    <Button
      id="identity-btn-verify"
      className={`ml-auto px-6 py-4 text-base font-bold text-white`}
      onClick={() => {
        IDENTITY_CLIENT.startVerification();
      }}
    >
      Verify
    </Button>
  );
};
