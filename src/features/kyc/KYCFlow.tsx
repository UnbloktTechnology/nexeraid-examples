import { useCallback, useEffect, useState } from "react";
import KycClient from "@nexeraid/kyc-sdk/client";
import { useAccount, useSignMessage, useWalletClient } from "wagmi";
import { getAccessToken } from "../apiClient";
import { KYC_CLIENT } from "../kycClient";

export const KYCFlow = () => {
  const signMessage = useSignMessage();
  const { address, connector } = useAccount();
  const [initalized, setInitialized] = useState<
    "inital" | "signature" | "done"
  >("inital");
  const [auth, setAuth] = useState<{
    accessToken: string;
    signingMessage: string;
    signature: string;
  }>();

  const configKYCClient = useCallback(async () => {
    KYC_CLIENT.onSignPersonalData(async (data: string) => {
      return await signMessage.signMessageAsync({ message: data });
    });
    const signingMessage = KycClient.buildSignatureMessage(address as string);
    const signature = await signMessage.signMessageAsync({
      message: signingMessage,
    });
    const accessToken = await getAccessToken(address as string);
    setAuth({
      accessToken,
      signingMessage,
      signature,
    });
  }, [address, signMessage]);

  useEffect(() => {
    if (!address || !signMessage || !connector) return;
    if (!auth && initalized === "inital") {
      setInitialized("signature");
      void configKYCClient();
    }
    if (auth && initalized === "signature") {
      setInitialized("done");
      KYC_CLIENT.init({
        auth,
        initOnFlow: "REQUEST",
      });
    }
  }, [address, auth, configKYCClient, initalized, signMessage, connector]);

  return (
    <div>
      <button disabled={!auth} id="kyc-btn">
        Start KYC
      </button>
    </div>
  );
};
