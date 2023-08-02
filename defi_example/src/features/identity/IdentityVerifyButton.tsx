import { useKycAuthentication } from "@/features/identity/useKycAuthenticate";
import { IDENTITY_CLIENT } from "@/features/identity/IdentityClient";

export const IdentityVerifyButton = () => {
  const { accessToken, signingMessage, signature } = useKycAuthentication();
  return (
    <button
      id="kyc-btn-verify"
      className="mt-3 h-14 w-full rounded-3xl bg-[#4c82fb3d] text-center text-xl font-bold text-[#4C82FB]"
      onClick={() => {
        IDENTITY_CLIENT.startVerification({
          accessToken,
          signingMessage,
          signature,
        });
      }}
    >
      Verify
    </button>
  );
};
