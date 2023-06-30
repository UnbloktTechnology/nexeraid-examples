import { useGlobalModals } from "@/features/Modals/useGlobalModals";
import { useKycAuthentication } from "@/features/kyc/useKycAuthenticate";
import { KYC_CLIENTS } from "@/features/kyc/KycClient";
import { useEffect } from "react";
import { getSigner } from "@/appConfig";
import { toast } from "react-toastify";
import { useCheckCompliance } from "@/features/kyc/useCheckCompliance";

export const KycVerifyButton = () => {
  const { close } = useGlobalModals((state) => ({
    close: state.close,
  }));
  const { accessToken, signingMessage, signature, user } =
    useKycAuthentication();
  const checkCompliance = useCheckCompliance();
  const kycClient = KYC_CLIENTS.verify;

  useEffect(() => {
    if (user && accessToken && signingMessage && signature && kycClient) {
      console.log("init kyc client", {
        accessToken,
        signingMessage,
        signature,
      });
      kycClient.onSignPersonalData(async (data: string) => {
        console.log("on sign personal data");
        const signer = getSigner(user);
        return await signer.signMessage(data);
      });
      kycClient.onOffChainShareCompletition(() => {
        void (async () => {
          const result = await checkCompliance.mutateAsync();
          console.log("result", result);
          if (result) {
            toast(`Your identity has been verified`);
            close();
          } else {
            toast(`Your identity has not been verified`);
          }
        })();
      });
      kycClient.init({
        auth: {
          accessToken,
          signingMessage,
          signature,
        },
        initOnFlow: "REQUEST",
      });
    }
  }, [user, accessToken, signingMessage, signature]);

  return <button id="kyc-btn-verify">Verify</button>;
};
