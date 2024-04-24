import React from "react";
import { useCallback, useState } from "react";
import { buildSignatureMessage } from "@nexeraid/identity-sdk";

import styles from "./client.module.css";
import { IDENTITY_CLIENT } from "./IdentityClient";
import { fetchAccessToken } from "@/utils/fetchAccessToken";
import type {
  BlockchainAddress,
  BlockchainNamespace,
} from "@nexeraprotocol/identity-schemas";

export const IdentityFlow = (props: {
  setDID: (did: string) => void;
  signMessageAsync: (message: string) => Promise<string>;
  address: BlockchainAddress | undefined;
  blockchainNamespace: BlockchainNamespace;
}) => {
  const [isIdentityClientInit, setIsIdentityClientInit] = useState(false);
  const [auth, setAuth] = useState<{
    accessToken: string;
    signingMessage: string;
    signature: string;
  }>();

  const configIdentityClient = useCallback(async () => {
    if (props.address) {
      IDENTITY_CLIENT.onSignMessage(async (data) => {
        return await props.signMessageAsync(data.message);
      });
      const signingMessage = buildSignatureMessage(props.address);
      const signature = await props.signMessageAsync(signingMessage);
      const response = await fetchAccessToken(
        {
          address: props.address,
          blockchainNamespace: props.blockchainNamespace,
        },
        "kyc",
      );
      const accessToken = response.accessToken;
      IDENTITY_CLIENT.onSdkReady((data) => {
        console.log("NexeraKyc.tsx onSdkReady", data);
        props.setDID(data.did);
      });
      await IDENTITY_CLIENT.init({
        accessToken: accessToken,
        signature: signature,
        signingMessage: signingMessage,
      });
      setIsIdentityClientInit(true);
      setAuth({
        accessToken,
        signingMessage,
        signature,
      });
    }
  }, [props]);

  return (
    <div>
      <h1>Identity Flow</h1>
      {!auth && (
        <div>
          <h2>Not Authenticated</h2>
          <button
            className={styles.authenticateButton}
            disabled={!props.address}
            onClick={() => void configIdentityClient()}
          >
            Authenticate
          </button>
        </div>
      )}
      {auth &&
        (isIdentityClientInit ? (
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
                IDENTITY_CLIENT.startVerification();
              }}
              id="identity-btn"
            >
              Start KYC
            </button>
          </div>
        ) : (
          "Awaiting identity client initialization..."
        ))}
    </div>
  );
};
