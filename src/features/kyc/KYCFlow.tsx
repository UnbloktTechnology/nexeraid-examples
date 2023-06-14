import { useEffect, useState } from "react";
import KycClient from "@nexeraid/kyc-sdk/client";
import { useAccount, useSignMessage, useWalletClient } from "wagmi";
import { appConfig } from "../../appConfig";
import { env } from "../../env.mjs";
import { getAccessToken } from "../apiClient";
import { KYC_CLIENT } from "../kycClient";

export const KYCFlow = () => {
  const { signMessageAsync } = useSignMessage();
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();

  const [auth, setAuth] = useState<any>();

  const configKYCClient = async () => {
    // configure kyc flow callbacks
    // mandatory onSignPersonalData callback
    KYC_CLIENT.onSignPersonalData(async (data: string) => {
      // make user sign data with wallet, and return result
      return await signMessageAsync({ message: data });
    });
    // optional onZkCallback (mandatory if zk flow will be used)
    KYC_CLIENT.onZkCallback(async (data) => {
      // make wallet user send transaction, using data from kyc app, and returning transaction hash
      // @ts-ignore
      const txHash = await walletClient?.sendTransaction(data);
      return txHash as string;
    });
    // build signing message, needed to safetly store kyc in user's browser
    const signingMessage = KycClient.buildSignatureMessage(address as string);
    const signature = await signMessageAsync({ message: signingMessage });
    // here you need to get access token from your server, which will call our backend as we explained in the Server app section

    // TODO - Check functionality
    const accessToken = await getAccessToken(address as string);

    // finally, once accessToken, signingMessage and signature ready, and button defined, KycClient can be initialised
    setAuth({
      accessToken,
      signingMessage,
      signature,
    });
  };

  useEffect(() => {
    if (address) {
      setTimeout(() => {
        configKYCClient();
      }, 200);
    }
  }, [address]);

  useEffect(() => {
    if (auth) {
      KYC_CLIENT.init({
        auth,
        initOnFlow: "REQUEST", // flows available: "REQUEST" | "MANAGEMENT"
      });
    }
  }, [auth]);

  return (
    <div>
      <button disabled={!auth} id="kyc-btn">
        Start KYC
      </button>
    </div>
  );
};
