/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect } from "react";
import { KYC_CLIENTS } from "@/features/Services/KycClient";
import { useKycAuthentication } from "@/features/Hooks/useKycAuthenticate";
import { useGlobalModals } from "@/features/Modals/useGlobalModals";
import { useQueryClient } from "@tanstack/react-query";
import { useSignMessage } from "wagmi";

export const KycVerifyButton = () => {
  const { accessToken, signingMessage, signature } = useKycAuthentication();
  const { close } = useGlobalModals((state) => ({
    close: state.close,
    data: state.data,
  }));
  const { signMessageAsync } = useSignMessage();
  const queryClient = useQueryClient();
  const kycClient = KYC_CLIENTS.verify;

  if (!kycClient) throw new Error("No kyc client");

  kycClient.onInitKycData((data) => {
    return data;
  });
  kycClient.onSignPersonalData(async (data: string) => {
    console.log("on sign personal data");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await signMessageAsync({ message: data });
  });
  kycClient.onKycCompletion(
    (idScanVerifiableCredential: string, id3VerifiableCredential: string) => {
      console.log("idScanVerifiableCredential", idScanVerifiableCredential);
      console.log("id3VerifiableCredential", id3VerifiableCredential);
      void queryClient.invalidateQueries();
    }
  );

  useEffect(() => {
    if (accessToken && signingMessage && signature) {
      console.log("init kyc client", {
        accessToken,
        signingMessage,
        signature,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button onClick={close} id="kyc-btn-verify">
      Verify
    </button>
  );
};
