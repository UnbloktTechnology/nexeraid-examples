import React, { useEffect } from "react";
import { DisclaimerOverlay } from "@/features/bank/Components/DisclaimerOverlay";
import { Dashboard } from "@/features/bank/Dashboard";
import { Banner, Content, Header, Layout } from "@/features/bank/Layout";
import { useGlobalModals } from "@/features/bank/Modals/useGlobalModals";
import { ToastContainer } from "react-toastify";
import { NexeraIdProvider, useCustomerStatus } from "@nexeraid/react-sdk";
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

  const customerStatus = useCustomerStatus();
  const isCompliant = customerStatus.data === "Active";
  useEffect(() => {
    if (isCompliant) {
      close();
    }
  }, [isCompliant, close]);

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
      header={!isCompliant ? <Header onClickLogOn={onClickLogOn} /> : <></>}
      className={!isCompliant ? "px-[105px]" : "bg-[#F2F2F2]"}
    >
      {!isCompliant ? (
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
