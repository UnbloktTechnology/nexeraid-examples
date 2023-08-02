import React from "react";
import { useCallback, useState } from "react";
import IdentityClient from "@nexeraid/identity-sdk/client";
import { useAccount, useSignMessage } from "wagmi";
import { getAccessToken } from "../apiClient";
import { WebHooks } from "../webhooks/WebHooks";
import { IDENTITY_CLIENT } from "../../appConfig";
import styles from "./client.module.css";

export const IdentityFlow = () => {
  const signMessage = useSignMessage();
  const { address, isConnected } = useAccount();
  const [auth, setAuth] = useState<{
    accessToken: string;
    signingMessage: string;
    signature: string;
  }>();

  const configIdentityClient = useCallback(async () => {
    IDENTITY_CLIENT.onSignPersonalData(async (data: string) => {
      return await signMessage.signMessageAsync({ message: data });
    });
    const signingMessage = IdentityClient.buildSignatureMessage(address as string);
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

  return (
    <div>
      <h1>Identity Flow</h1>
      {!auth && (
        <div>
          <h2>Not Authenticated</h2>
          <button
            className={styles.authenticateButton}
            disabled={!address || !isConnected}
            onClick={configIdentityClient}
          >
            Authenticate
          </button>
        </div>
      )}
      {auth && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            style={{
              padding: "16px 24px",
              borderRadius: 16,
              cursor: "pointer",
              backgroundColor: "#0258FD",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
              border: "none",
            }}
            onClick={() => {
              IDENTITY_CLIENT.startVerification(auth);
            }}
            id="identity-btn"
          >
            Start KYC
          </button>
        </div>
      )}

      {auth && <WebHooks />}
    </div>
  );
};
