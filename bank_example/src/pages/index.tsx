import React, { useContext, useEffect } from "react";
import { DisclaimerOverlay } from "@/features/Components/DisclaimerOverlay";
import { Dashboard } from "@/features/Dashboard";

import { Banner, Content, Header, Layout } from "@/features/Layout";
import { SimpleAuthContext } from "@/features/SimpleAuthProvider";
import { useGlobalModals } from "@/features/Modals/useGlobalModals";
import { toast } from "react-toastify";
import { useKycAuthentication } from "@/features/kyc/useKycAuthenticate";
import { useIsUserCompliant } from "@/features/kyc/useIsUserCompliant";
import { KYC_CLIENTS } from "@/features/kyc/KycClient";
import { getSigner, TEST_USERS, TestUser } from "@/appConfig";

const Home = () => {
  const { openModal, close } = useGlobalModals((state) => ({
    openModal: state.open,
    close: state.close,
  }));
  const { isLogin, signIn, getUser } = useContext(SimpleAuthContext);
  const { authenticate, accessToken, signingMessage, signature } =
    useKycAuthentication();
  const user = getUser();
  const { data: isUserCompliant } = useIsUserCompliant();
  const kycClient = KYC_CLIENTS.verify;
  console.log("isUserCompliant", isUserCompliant);

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
      kycClient.onKycCompletion(
        (idScanVerifiableCredential, id3VerifiableCredential) => {
          console.log(
            "id3VerifiableCredential from onKycCompletion",
            id3VerifiableCredential
          );
          console.log(
            "idScanVerifiableCredential from onKycCompletion",
            idScanVerifiableCredential
          );
        }
      );
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

  const logOnSuccessfull = (user: TestUser) => {
    close();
    console.log("GO TO DASHBOARD");
    console.log("USER", user);
  };

  const onAuthenticate = (user: TestUser) => {
    if (signIn(user)) {
      void authenticate.mutate({ user });
      if (isUserCompliant) {
        logOnSuccessfull(user);
      }
    }
  };

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
        userData: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          users: TEST_USERS,
          onSuccess: logOnSuccessfull,
          onAuthenticate: onAuthenticate,
        },
      }
    );
  };

  return (
    <Layout
      header={
        !isLogin || !isUserCompliant ? (
          <Header onClickLogOn={onClickLogOn} />
        ) : (
          <></>
        )
      }
      className={!isLogin || !isUserCompliant ? "px-[105px]" : "bg-[#F2F2F2]"}
    >
      {!isLogin || !isUserCompliant ? (
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
