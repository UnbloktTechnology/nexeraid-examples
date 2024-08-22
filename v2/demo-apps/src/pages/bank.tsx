import React, { useEffect, useState } from "react";
import { DisclaimerOverlay } from "@/features/bank/Components/DisclaimerOverlay";
import { Dashboard } from "@/features/bank/Dashboard";

import { Banner, Content, Header, Layout } from "@/features/bank/Layout";
import { useGlobalModals } from "@/features/bank/Modals/useGlobalModals";
import { toast, ToastContainer } from "react-toastify";
import { useCheckBankCompliance } from "@/features/bank/identity/useCheckBankCompliance";
import { NexeraIdProvider } from "@nexeraid/react-sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { nexeraIdConfig } from "@/features/bank/identity/nexeraIdConfig";

const queryClient = new QueryClient();

const Home = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NexeraIdProvider config={nexeraIdConfig}>
        <HomeContent />
        <ReactQueryDevtools initialIsOpen={false} />
        <ToastContainer />
      </NexeraIdProvider>
    </QueryClientProvider>
  );
};

const HomeContent = () => {
  const { openModal, close } = useGlobalModals((state) => ({
    openModal: state.open,
    close: state.close,
    data: state.data,
  }));
  const [kycCompletion, setKycCompletion] = useState(false);
  const [isCompliance, setIsCompliance] = useState(false);
  const { data } = useCheckBankCompliance(kycCompletion);

  useEffect(() => {
    console.log("EXECUTING isVerified check compliance: ", data);
    if (data === undefined) {
      return;
    }
    if (data.isValid) {
      toast("Compliance Verification: Your identity has been verified");
      setKycCompletion(false);
      setIsCompliance(true);
    } else if (data.data === "unknown") {
      setKycCompletion(true);
    } else {
      toast("Compliance Verification: Your identity has not been verified");
      setKycCompletion(false);
      setIsCompliance(false);
    }
  }, [data]);

  useEffect(() => {
    if (isCompliance) {
      close();
    }
  }, [isCompliance, close]);

  const onClickLogOn = () => {
    console.log("openModal");
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
