import { useEffect, useState } from "react";
import { Dashboard } from "@/features/bank-web3/Dashboard";

import { Content, Header, Layout } from "@/features/bank-web3/Layout";
import { useGlobalModals } from "@/features/bank-web3/Modals/useGlobalModals";
import { IDENTITY_CLIENT } from "@/features/bank-web3/identity/IdentityClient";
import { toast } from "react-toastify";
import { useSignMessage } from "wagmi";
import { useKycBankWeb3Authentication } from "@/features/bank-web3/identity/useKycBankWeb3Authenticate";
import { useCheckBankWeb3Compliance } from "@/features/bank-web3/identity/useCheckBankWeb3Compliance";
import { useQueryClient } from "@tanstack/react-query";

const Home = () => {
  const { openModal, close } = useGlobalModals((state) => ({
    openModal: state.open,
    close: state.close,
    data: state.data,
  }));
  const { user, accessToken, signingMessage, signature } =
    useKycBankWeb3Authentication();
  const signMessage = useSignMessage();
  const [isKycComplete, setIsKycComplete] = useState(false);
  const [isCompliant, setIsCompliant] = useState(false);
  const { data } = useCheckBankWeb3Compliance(isKycComplete);
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log("EXECUTING isVerified check compliance: ", data);
    if (!!data) {
      if (data.isValid) {
        toast(`Your identity has been verified`);
        setIsKycComplete(false);
        setIsCompliant(true);
      } else if (data.data === "not_received") {
        setIsKycComplete(true);
      } else {
        toast(`Your identity has not been verified`);
        setIsKycComplete(false);
        setIsCompliant(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (isCompliant) {
      close();
    }
  }, [isCompliant]);

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
        console.log("on kyc completion", data);
        setIsKycComplete(true);
      });
      IDENTITY_CLIENT.onCloseScreen(() => {
        queryClient.invalidateQueries();
        setIsKycComplete(true);
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
    <Layout
      header={!isCompliant ? <Header onClickLogOn={onClickLogOn} /> : <></>}
      className={!isCompliant ? "px-[105px]" : "bg-[#F2F2F2]"}
    >
      {!isCompliant ? <Content onClickLogOn={onClickLogOn} /> : <Dashboard />}
    </Layout>
  );
};

export default Home;
