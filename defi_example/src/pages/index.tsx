import { Swap } from "@/features/Components/Swap";
import { useCheckCompliance } from "@/features/kyc/useCheckCompliance";
import { Header } from "@/features/Layout/Header";
import { Layout } from "@/features/Layout/Layout";
import { useGlobalModals } from "@/features/Modals/Hooks/useGlobalModals";
import { useKycAuthentication } from "@/features/kyc/useKycAuthenticate";
import { useEffect } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { KYC_CLIENTS } from "@/features/kyc/KycClient";
import { toast } from "react-toastify";

const Home = () => {
  const { openModal } = useGlobalModals((state) => ({
    openModal: state.open,
    close: state.close,
  }));
  const isUserCompliant = useCheckCompliance();
  const address = useAccount();
  const { accessToken, signingMessage, signature } = useKycAuthentication();
  const { checkCompliance } = useCheckCompliance();
  const kycClient = KYC_CLIENTS.verify;
  const signMessage = useSignMessage();

  useEffect(() => {
    console.log("accessToken", accessToken);

    if (
      address.address &&
      accessToken &&
      signingMessage &&
      signature &&
      kycClient
    ) {
      console.log("init kyc client", {
        accessToken,
        signingMessage,
        signature,
      });
      kycClient.onSignPersonalData(async (data: string) => {
        console.log("on sign personal data");
        return await signMessage.signMessageAsync({
          message: data,
        });
      });
      kycClient.onKycCompletion((data) => {
        void (async () => {
          console.log("on kyc completion", data);
          const result = await checkCompliance.mutateAsync();
          console.log("result", result);
          if (result) {
            toast(`Your identity has been verified`);
            close();
          } else {
            toast(`Your identity has not been verified`);
          }
        })();
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
  }, [address.address, accessToken, signingMessage, signature]);

  const onClickLogOn = () => {
    openModal(
      "KycModal",
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
    <Layout header={<Header />} bg={"defi"}>
      <>
        <Swap />
        {!isUserCompliant.checkCompliance && (
          <>
            <div className="absolute left-1/2 top-24 z-0 h-1/2 w-[480px] -translate-x-1/2 rounded-3xl bg-gradient-to-t from-[#ff57db95] to-[#a697ff00]" />
            <div className="absolute top-0 z-20 h-screen w-screen bg-gradient-to-t from-[#080A18] from-50% to-transparent to-95%">
              <div className="fixed bottom-32 w-full">
                <div className="mx-auto flex w-[800px] flex-col gap-4 text-center">
                  <h1 className="bg-gradient-to-t from-[#FFF4CF] to-[#FF57DA] bg-clip-text text-[64px] font-bold leading-[72px] text-transparent">
                    Welcome to the new Institutional Uniswap app
                  </h1>

                  <div className="text-[#98A1C0]">
                    <h6>1. Verify your identity off-chain to access the app</h6>
                  </div>
                </div>

                <button
                  className="mx-auto mt-11 h-14 w-80 rounded-2xl border-none bg-gradient-to-r from-[#FF00C7] to-[#FF9FFB] text-xl"
                  onClick={() => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    openModal(
                      "KycModal",
                      {
                        modalType: "center",
                        overlayType: "dark",
                        style: "rounded",
                        bg: "defi",
                      },
                      {
                        initOnFlow: "REQUEST",
                        basicData: {
                          text: "Authenticate and then Verify yourself",
                          icon: "kyc",
                          textButton: "Verify",
                        },
                      }
                    );
                  }}
                >
                  Get started
                </button>
              </div>
            </div>
          </>
        )}
      </>
    </Layout>
  );
};

export default Home;
