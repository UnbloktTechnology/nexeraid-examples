import { useEffect, useState } from "react";
import { Dashboard } from "@/features/sygnum-web3/Dashboard";

import { Content, Header, Layout, Footer } from "@/features/sygnum-web3/Layout";
import { useGlobalModals } from "@/features/sygnum-web3/Modals/useGlobalModals";
import { IDENTITY_CLIENT } from "@/features/sygnum-web3/identity/IdentityClient";
import { toast } from "react-toastify";
import { useSignMessage } from "wagmi";
import { useKycSygnumWeb3Authentication } from "@/features/sygnum-web3/identity/useKycSygnumWeb3Authentication";
import { useCheckSygnumWeb3Compliance } from "@/features/sygnum-web3/identity/useCheckSygnumWeb3Compliance";

const Home = () => {
  const { openModal, close } = useGlobalModals((state) => ({
    openModal: state.open,
    close: state.close,
    data: state.data,
  }));
  const { user, accessToken, signingMessage, signature } =
    useKycSygnumWeb3Authentication();
  const signMessage = useSignMessage();
  const [kycCompletion, setKycCompletion] = useState(false);
  const { data } = useCheckSygnumWeb3Compliance(kycCompletion);
  const [isCompliance, setIsCompliance] = useState(false);

  useEffect(() => {
    if (document.readyState === "complete" && typeof window !== "undefined") {
      const loader = document.getElementById("globalLoader");
      if (loader) loader.remove();
    }
  }, []);

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
        return await signMessage.signMessageAsync({
          message: data.message,
        });
      });
      IDENTITY_CLIENT.onKycCompletion((data) => {
        void (() => {
          console.log("on kyc completion", data);
          setKycCompletion(true);
        })();
      });
      // TODO: properly wait for init resolve
      void IDENTITY_CLIENT.init({
        accessToken,
        signingMessage,
        signature,
      });
    }
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
    <>
      <div id="globalLoader">
        <img src="images/loadingIcon.gif" alt="loader" />
      </div>
      <Layout
        header={!isCompliance ? <Header onClickLogOn={onClickLogOn} /> : <></>}
        className={!isCompliance ? "px-[105px]" : "bg-[#F2F2F2]"}
      >
        {!isCompliance ? (
          <Content onClickLogOn={onClickLogOn} />
        ) : (
          <Dashboard />
        )}
      </Layout>
      {!isCompliance ? <Footer onClickLogOn={onClickLogOn} /> : <></>}
    </>
  );
};

export default Home;
