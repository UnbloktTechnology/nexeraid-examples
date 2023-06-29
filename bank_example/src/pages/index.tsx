import React, { useEffect } from "react";
import { DisclaimerOverlay } from "@/features/Components/DisclaimerOverlay";
import { Dashboard } from "@/features/Dashboard";

import { Banner, Content, Header, Layout } from "@/features/Layout";
import { useGlobalModals } from "@/features/Modals/useGlobalModals";
import { toast } from "react-toastify";
import { useKycAuthentication } from "@/features/kyc/useKycAuthenticate";
import { useCheckCompliance } from "@/features/kyc/useCheckCompliance";
import { KYC_CLIENTS } from "@/features/kyc/KycClient";
import { getSigner } from "@/appConfig";

const Home = () => {
  const { openModal } = useGlobalModals((state) => ({
    openModal: state.open,
    close: state.close,
  }));
  const { accessToken, signingMessage, signature, user } =
    useKycAuthentication();
  const checkCompliance = useCheckCompliance();
  const kycClient = KYC_CLIENTS.verify;

  useEffect(() => {
    if (user && accessToken && signingMessage && signature && kycClient) {
      kycClient.onOffChainShareCompletition(() => {
        toast(`Off chain data sharing completed`);
      });
      kycClient.onSignPersonalData(async (data: string) => {
        console.log("on sign personal data");
        const signer = getSigner(user);
        return await signer.signMessage(data);
      });
      kycClient.onOffChainShareCompletition(() => {
        console.log("on kyc completion");
        void checkCompliance.mutateAsync();
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
  }, [user, accessToken, signingMessage, signature, kycClient]);

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
        <>
          <Banner />
          <Content />
        </>
      ) : (
        <Dashboard />
      )}
      <DisclaimerOverlay
        content="This web application  is a simulated, mockup banking application developed solely for the purpose of demonstrating the functionalities and capabilities of the NexeraID product. It is not affiliated with, endorsed by, or in any way associated with any real-world banking or financial institution."
        textButton="I understood"
        className="bg-[#3E505D]"
        classNameButton="border-none !rounded-none !bg-[#DB0011] font-normal"
      />
    </Layout>
  );
};

export default Home;
