import React, { useCallback, useState } from "react";
import { buildSignatureMessage } from "@nexeraid/identity-sdk";
import { IDENTITY_CLIENT } from "./IdentityClient";
import { fetchAccessToken } from "@/utils/fetchAccessToken";
import type {
  BlockchainAddress,
  BlockchainNamespace,
} from "@nexeraprotocol/identity-schemas";

import { type Address } from "viem";
import { useKYCContext } from "../kyc-airdrop/providers/KYCContext";

export const IdentityFlowAirdrop = (props: {
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

  const {
    checkIfWalletIsWhitelisted,
    isWalletChecked,
    isWalletWhitelisted,
    isWalletAuthorized,
  } = useKYCContext();

  const configIdentityClient = useCallback(async () => {
    if (props.address) {
      checkIfWalletIsWhitelisted(props.address as Address);
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
  }, [checkIfWalletIsWhitelisted, props]);

  return (
    <div>
      {!auth && !isWalletChecked && (
        <button
          className="rounded-full bg-white px-4 py-2 font-medium text-black shadow hover:bg-gray-100"
          disabled={!props.address}
          onClick={() => void configIdentityClient()}
        >
          Authenticate
        </button>
      )}
      {auth &&
        isWalletWhitelisted &&
        isWalletChecked &&
        isWalletAuthorized &&
        (isIdentityClientInit ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              className="rounded-full bg-white px-4 py-2 font-medium text-black shadow hover:bg-gray-100"
              onClick={() => {
                IDENTITY_CLIENT.startVerification();
              }}
              id="identity-btn"
            >
              Begin identity verification
            </button>
          </div>
        ) : (
          "Awaiting identity client initialization..."
        ))}
    </div>
  );
};
