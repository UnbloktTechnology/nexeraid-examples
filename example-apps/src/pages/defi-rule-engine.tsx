import { Swap } from "@/features/defi-rule-engine/Components/Swap";
import { useCheckDefiRuleEngineCompliance } from "@/features/defi-rule-engine/identity/useCheckDefiRuleEngineCompliance";
import { Header } from "@/features/defi-rule-engine/Layout/Header";
import { Layout } from "@/features/defi-rule-engine/Layout/Layout";
import { useGlobalModals } from "@/features/defi-rule-engine/Modals/Hooks/useGlobalModals";
import { useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { IDENTITY_CLIENT } from "@/features/defi-rule-engine/identity/IdentityClient";
import { toast } from "react-toastify";
import { useDefiRuleEngineKycAuthentication } from "@/features/defi-rule-engine/identity/useDefiOffChainZKPKycAuthenticate";

const DefiRuleEngine = () => {
  const close = useGlobalModals((state) => state.close);
  const address = useAccount();
  const { accessToken, signingMessage, signature, setIsIdentityClientInit } =
    useDefiRuleEngineKycAuthentication();
  const [kycCompletion, setKycCompletion] = useState(false);
  const { data } = useCheckDefiRuleEngineCompliance(kycCompletion);
  const [isCompliance, setIsCompliance] = useState(false);
  const signMessage = useSignMessage();
  const [started, setStarted] = useState(false);

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
      if (address.address && accessToken && signingMessage && signature) {
        IDENTITY_CLIENT.onSignMessage(async (data) => {
          console.log("On sign personal data");
          return await signMessage.signMessageAsync({
            message: data.message,
          });
        });
        IDENTITY_CLIENT.onKycCompletion((data) => {
          console.log("On kyc completion", data);
          setKycCompletion(true);
        });
        IDENTITY_CLIENT.onCloseScreen(async () => {
          return new Promise((resolve) => {
            console.log("On Close Screen callback");
            setKycCompletion(true);
            resolve("");
          });
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
  }, [address.address, accessToken, signingMessage, signature]);

  return (
    <Layout header={<Header />} bg={"defi"}>
      <>
        <Swap isCompliant={isCompliance} />
        {!isCompliance && !started && (
          <>
            <div className="absolute left-1/2 top-24 z-0 h-1/2 w-[480px] -translate-x-1/2 rounded-3xl bg-gradient-to-t from-[#FF5237] to-[#FFA59700]" />
            <div className="absolute top-0 z-20 h-screen w-screen bg-gradient-to-t from-[#080A18] from-50% to-transparent to-95%">
              <div className="fixed bottom-32 w-full text-center">
                <div className="mx-auto flex w-[800px] flex-col gap-4 text-center">
                  <h1 className="bg-gradient-to-t from-[#DEFFCF] to-[#FF5D57] bg-clip-text text-[64px] font-bold leading-[72px] text-transparent">
                    Welcome to the new Institutional Uniswap dApp
                  </h1>

                  <div className="text-[#98A1C0]">
                    <h6>1. Verify your identity off-chain to access the app</h6>
                  </div>
                </div>

                <button
                  type="button"
                  className="mx-auto mt-11 h-14 w-80 rounded-2xl border-none bg-gradient-to-r from-[#FF2200] to-[#FFAC9F] text-center text-xl text-white"
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

export default DefiRuleEngine;
