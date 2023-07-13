import { useEffect } from "react";
import { Dashboard } from "@/features/Dashboard";

import { Content, Header, Layout } from "@/features/Layout";
import { useGlobalModals } from "@/features/Modals/useGlobalModals";
import { useKycAuthentication } from "@/features/kyc/useKycAuthenticate";
import { useCheckCompliance } from "@/features/kyc/useCheckCompliance";
import { KYC_CLIENTS } from "@/features/kyc/KycClient";
import { toast } from "react-toastify";
import { useSignMessage } from "wagmi";

const Home = () => {
  const { openModal, close } = useGlobalModals((state) => ({
    openModal: state.open,
    close: state.close,
    data: state.data,
  }));
  const { accessToken, signingMessage, signature, user } =
    useKycAuthentication();
  const { checkCompliance } = useCheckCompliance();
  const kycClient = KYC_CLIENTS.verify;
  const signMessage = useSignMessage();

  useEffect(() => {
    if (user && accessToken && signingMessage && signature && kycClient) {
      console.log("init kyc client", {
        accessToken,
        signingMessage,
        signature,
      });
      kycClient.onSignPersonalData(async (data: string) => {
        console.log("on sign personal data");
        return await signMessage.signMessageAsync({
          message: data,
        });
      });
      kycClient.onKycCompletion((data) => {
        void (async () => {
          console.log("on kyc completion", data);
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

  const onClickLogOn = () => {
    openModal(
      "LogOnModal",
      {
        modalType: "center",
        overlayType: "dark",
      },
      {
        basicData: {
          text: "",
          icon: "help",
          textButton: "Verify Identity",
        },
      }
    );
  };

  return (
    <Layout
      header={
        !checkCompliance.data ? <Header onClickLogOn={onClickLogOn} /> : <></>
      }
      className={!checkCompliance.data ? "px-[105px]" : "bg-[#F2F2F2]"}
    >
      {!checkCompliance.data ? (
        <Content onClickLogOn={onClickLogOn} />
      ) : (
        <Dashboard />
      )}
    </Layout>
  );
};

export default Home;
