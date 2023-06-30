import React from "react";
import { DisclaimerOverlay } from "@/features/Components/DisclaimerOverlay";
import { Dashboard } from "@/features/Dashboard";

import { Banner, Content, Header, Layout } from "@/features/Layout";
import { useGlobalModals } from "@/features/Modals/useGlobalModals";
import { useCheckCompliance } from "@/features/kyc/useCheckCompliance";

const Home = () => {
  const { openModal } = useGlobalModals((state) => ({
    openModal: state.open,
    close: state.close,
  }));
  const checkCompliance = useCheckCompliance();
  console.log("checkCompliance", checkCompliance.data);

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
