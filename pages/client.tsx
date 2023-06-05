"use client";

import { useEffect, useState } from "react";
import KycClient from "@nexeraid/kyc-sdk/client";
import { useConnect, useSignMessage, useWalletClient } from "wagmi";

const KYC_CLIENT = new KycClient({ identifier: "myIdentifier" });

export default function Counter() {
  const { signMessageAsync, error: connectorError } = useSignMessage();
  const { data: walletClient } = useWalletClient();
  const { connect, connectors, pendingConnector, error, isLoading } =
    useConnect();
  const address = "0x82732eCa78474A772799b341100098F05464c401";

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
      const txHash = await walletClient?.sendTransaction(data);
      return txHash as string;
    });
    // build signing message, needed to safetly store kyc in user's browser
    const signingMessage = KycClient.buildSignatureMessage(address);
    const signature = await signMessageAsync({ message: signingMessage });
    // here you need to get access token from your server, which will call our backend as we explained in the Server app section

    // TODO - Check functionality
    const accessToken = "token"; // getAccessTokenFromYourServer(address);

    // finally, once accessToken, signingMessage and signature ready, and button defined, KycClient can be initialised
    console.log(
      "ALL REQUIRED FIELDS: ",
      accessToken,
      signingMessage,
      signature
    );

    setAuth({
      accessToken,
      signingMessage,
      signature,
    });
  };

  useEffect(() => {
    configKYCClient();
  }, []);

  useEffect(() => {
    if (auth) {
      KYC_CLIENT.init({
        auth,
        initOnFlow: "REQUEST", // flows available: "REQUEST" | "MANAGEMENT"
      });
    }
  }, [auth]);

  return (
    <main>
      <div>
        {connectors.map((connector) => (
          <button
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect({ connector })}
          >
            {connector.name}
            {/* {!connector.ready && " (unsupported)"} */}
            {/* {isLoading &&
              connector.id === pendingConnector?.id &&
              " (connecting)"} */}
          </button>
        ))}

        {error && <div>{error.message}</div>}
      </div>
      <div>
        <button id="kyc-btn">Start KYC</button>
      </div>
    </main>
  );
}
