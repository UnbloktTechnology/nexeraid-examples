import { useEffect, useState } from "react";
import { Dashboard } from "@/features/Dashboard";

import { Content, Header, Layout } from "@/features/Layout";
import { useGlobalModals } from "@/features/Modals/useGlobalModals";
import { useKycAuthentication } from "@/features/kyc/useKycAuthenticate";
import { useCheckCompliance } from "@/features/kyc/useCheckCompliance";
import { KYC_CLIENT } from "@/features/kyc/KycClient";
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
  const signMessage = useSignMessage();
  const [kycCompletion, setKycCompletion] = useState(false);
  const { checkCompliance } = useCheckCompliance(kycCompletion);
  const [isCompliance, setIsCompliance] = useState(false);

  useEffect(() => {
    console.log("result kyc compliance", checkCompliance);

    if (checkCompliance.data !== undefined) {
      if (checkCompliance.data) {
        toast(`Your identity has been verified`);
        setKycCompletion(false);
        setIsCompliance(true);
      } else {
        toast(`Your identity has not been verified`);
        setIsCompliance(false);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkCompliance]);

  useEffect(() => {
    if (isCompliance) {
      close();
    }
  }, [isCompliance]);

  useEffect(() => {
    if (user && accessToken && signingMessage && signature) {
      console.log("init kyc client", {
        accessToken,
        signingMessage,
        signature,
      });
      KYC_CLIENT.onSignPersonalData(async (data: string) => {
        console.log("on sign personal data");
        return await signMessage.signMessageAsync({
          message: data,
        });
      });
      KYC_CLIENT.onKycCompletion((data) => {
        void (() => {
          console.log("on kyc completion", data);
          setKycCompletion(true);
        })();
      });
      KYC_CLIENT.startVerification({
        accessToken,
        signingMessage,
        signature,
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
      header={!isCompliance ? <Header onClickLogOn={onClickLogOn} /> : <></>}
      className={!isCompliance ? "px-[105px]" : "bg-[#F2F2F2]"}
    >
      {!isCompliance ? <Content onClickLogOn={onClickLogOn} /> : <Dashboard />}
    </Layout>
  );
};

export default Home;
