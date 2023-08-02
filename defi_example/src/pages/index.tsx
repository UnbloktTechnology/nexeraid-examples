import { Swap } from "@/features/Components/Swap";
import { useCheckCompliance } from "@/features/identity/useCheckCompliance";
import { Header } from "@/features/Layout/Header";
import { Layout } from "@/features/Layout/Layout";
import { useGlobalModals } from "@/features/Modals/Hooks/useGlobalModals";
import { useKycAuthentication } from "@/features/identity/useKycAuthenticate";
import { useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { IDENTITY_CLIENT } from "@/features/identity/IdentityClient";
import { toast } from "react-toastify";

const Home = () => {
  const { close } = useGlobalModals((state) => ({
    openModal: state.open,
    close: state.close,
  }));
  const address = useAccount();
  const { accessToken, signingMessage, signature } = useKycAuthentication();
  const [kycCompletion, setKycCompletion] = useState(false);
  const { checkCompliance } = useCheckCompliance(kycCompletion);
  const [isCompliance, setIsCompliance] = useState(false);
  const signMessage = useSignMessage();
  const [started, setStarted] = useState(false);

  useEffect(() => {
    console.log("result kyc compliance", checkCompliance);

    if (checkCompliance.data !== undefined) {
      if (checkCompliance.data) {
        toast(`Your identity has been verified`);
        setKycCompletion(false);
        setIsCompliance(true);
      } else {
        toast(`Your identity has not been verified`);
        setIsCompliance(false);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkCompliance]);

  useEffect(() => {
    if (isCompliance) {
      close();
    }
  }, [isCompliance]);

  useEffect(() => {
    console.log("accessToken", accessToken);

    if (
      address.address &&
      accessToken &&
      signingMessage &&
      signature &&
      IDENTITY_CLIENT
    ) {
      console.log("init kyc client", {
        accessToken,
        signingMessage,
        signature,
      });
      IDENTITY_CLIENT.onSignPersonalData(async (data: string) => {
        console.log("on sign personal data");
        return await signMessage.signMessageAsync({
          message: data,
        });
      });
      IDENTITY_CLIENT.onKycCompletion((data) => {
        void (() => {
          console.log("on kyc completion", data);
          setKycCompletion(true);
        })();
      });
      IDENTITY_CLIENT.startVerification({
        accessToken,
        signingMessage,
        signature,
      });
    }
  }, [address.address, accessToken, signingMessage, signature]);

  return (
    <Layout header={<Header />} bg={"defi"}>
      <>
        <Swap isCompliant={isCompliance} />
        {!isCompliance && !started && (
          <>
            <div className="absolute left-1/2 top-24 z-0 h-1/2 w-[480px] -translate-x-1/2 rounded-3xl bg-gradient-to-t from-[#ff57db95] to-[#a697ff00]" />
            <div className="absolute top-0 z-20 h-screen w-screen bg-gradient-to-t from-[#080A18] from-50% to-transparent to-95%">
              <div className="fixed bottom-32 w-full text-center">
                <div className="mx-auto flex w-[800px] flex-col gap-4 text-center">
                  <h1 className="bg-gradient-to-t from-[#FFF4CF] to-[#FF57DA] bg-clip-text text-[64px] font-bold leading-[72px] text-transparent">
                    Welcome to the new Institutional Uniswap app
                  </h1>

                  <div className="text-[#98A1C0]">
                    <h6>1. Verify your identity off-chain to access the app</h6>
                  </div>
                </div>

                <button
                  className="mx-auto mt-11 h-14 w-80 rounded-2xl border-none bg-gradient-to-r from-[#FF00C7] to-[#FF9FFB] text-center text-xl"
                  onClick={() => setStarted(true)}
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
