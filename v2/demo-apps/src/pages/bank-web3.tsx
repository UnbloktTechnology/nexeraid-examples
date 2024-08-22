import { useEffect, useState } from "react";
import { Dashboard } from "@/features/bank-web3/Dashboard";
import { Content, Header, Layout } from "@/features/bank-web3/Layout";
import { useGlobalModals } from "@/features/bank-web3/Modals/useGlobalModals";
import { toast, ToastContainer } from "react-toastify";
import { WagmiProvider } from "wagmi";
import { useCheckBankWeb3Compliance } from "@/features/bank-web3/identity/useCheckBankWeb3Compliance";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NexeraIdProvider } from "@nexeraid/react-sdk";
import { nexeraIdConfig } from "@/features/bank-web3/identity/nexeraIdConfig";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { wagmiConfig } from "@/features/root/identity/wagmiConfig";

const queryClient = new QueryClient();

const Home = () => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <NexeraIdProvider config={nexeraIdConfig}>
            <HomeContent />
            <ReactQueryDevtools initialIsOpen={false} />
            <ToastContainer />
          </NexeraIdProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

const HomeContent = () => {
  const { openModal, close } = useGlobalModals((state) => ({
    openModal: state.open,
    close: state.close,
    data: state.data,
  }));
  const [isKycComplete, setIsKycComplete] = useState(false);
  const [isCompliant, setIsCompliant] = useState(false);
  const { data } = useCheckBankWeb3Compliance(isKycComplete);

  useEffect(() => {
    console.log("EXECUTING isVerified check compliance: ", data);
    if (data) {
      if (data.isValid) {
        toast("Compliance Verification: Your identity has been verified");
        setIsKycComplete(false);
        setIsCompliant(true);
      } else if (data.data === "unknown") {
        setIsKycComplete(true);
      } else {
        toast("Compliance Verification: Your identity has not been verified");
        setIsKycComplete(false);
        setIsCompliant(false);
      }
    }
  }, [data]);

  useEffect(() => {
    if (isCompliant) {
      close();
    }
  }, [isCompliant, close]);

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
