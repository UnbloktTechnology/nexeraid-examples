import React, { useEffect, useState } from "react";
import { DisclaimerOverlay } from "@/features/apps/bank/Components/DisclaimerOverlay";
import { Dashboard } from "@/features/apps/bank/Dashboard";

import { Banner, Content, Header, Layout } from "@/features/apps/bank/Layout";
import { useGlobalModals } from "@/features/apps/bank/Modals/useGlobalModals";
import { getSigner } from "@/appConfig";
import { toast } from "react-toastify";
import { useBankKycAuthentication } from "@/features/apps/bank/identity/useBankKycAuthenticate";
import { useCheckBankCompliance } from "@/features/apps/bank/identity/useCheckBankCompliance";
import { useQueryClient } from "@tanstack/react-query";
import { IDENTITY_CLIENT } from "@/features/identity-widget/IdentityClient";

const Home = () => {
  const { openModal, close } = useGlobalModals((state) => ({
    openModal: state.open,
    close: state.close,
    data: state.data,
  }));
  const queryClient = useQueryClient();
  const {
    user,
    accessToken,
    signingMessage,
    signature,
    setIsIdentityClientInit,
  } = useBankKycAuthentication();
  const [kycCompletion, setKycCompletion] = useState(false);
  const [isCompliance, setIsCompliance] = useState(false);
  const { data } = useCheckBankCompliance(kycCompletion);

  useEffect(() => {
    console.log("EXECUTING isVerified check compliance: ", data);
    if (data !== undefined) {
      if (data.isValid) {
        toast(`Compliance Verification: Your identity has been verified`);
        setKycCompletion(false);
        setIsCompliance(true);
      } else if (data.data === "unknown") {
        setKycCompletion(true);
      } else {
        toast(`Compliance Verification: Your identity has not been verified`);
        setKycCompletion(false);
        setIsCompliance(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (isCompliance) {
      close();
    }
  }, [isCompliance]);

  useEffect(() => {
    // make a autocallable async function
    const initIdentityClient = async () => {
      setIsIdentityClientInit(false);
      if (user && accessToken && signingMessage && signature) {
        console.log(
          "Ready to init: ",
          user,
          accessToken,
          signingMessage,
          signature,
        );
        IDENTITY_CLIENT.onSignMessage(async (data) => {
          console.log("on sign personal data");
          const signer = getSigner(user);
          return (await signer.signMessage(data.message)) as `0x${string}`;
        });
        IDENTITY_CLIENT.onKycCompletion((data) => {
          console.log("on kyc completion", data);
          setKycCompletion(true);
        });
        IDENTITY_CLIENT.onCloseScreen(async () => {
          console.log("on kyc completion", data);
          setKycCompletion(true);
          await queryClient.invalidateQueries();
          return "ok";
        });

        await IDENTITY_CLIENT.init({
          accessToken,
          signingMessage,
          signature,
        });
        setIsIdentityClientInit(true);
      }
    };
    void initIdentityClient();
  }, [user]);

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
      },
    );
  };

  return (
    <Layout
      header={!isCompliance ? <Header onClickLogOn={onClickLogOn} /> : <></>}
      className={!isCompliance ? "px-[105px]" : "bg-[#F2F2F2]"}
    >
      {!isCompliance ? (
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
