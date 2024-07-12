import React, { useCallback, useState } from "react";
import { buildSignatureMessage } from "@nexeraid/identity-sdk";
import { IDENTITY_CLIENT } from "../kyc-widget/IdentityClient";
import { fetchAccessToken } from "@/utils/fetchAccessToken";
import type {
  BlockchainAddress,
  BlockchainNamespace,
} from "@nexeraprotocol/identity-schemas";

import { type Address } from "viem";
import { useKYCContext } from "./providers/KYCContext";
import { Button } from "./components/Button";

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
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const { checkIfWalletIsWhitelisted, isWalletChecked, isWalletWhitelisted } =
    useKYCContext();

  const configIdentityClient = useCallback(async () => {
    if (props.address) {
      setIsAuthenticating(true);
      try {
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
      } catch (error) {
        console.error("Error during authentication:", error);
      } finally {
        setIsAuthenticating(false);
      }
    }
  }, [checkIfWalletIsWhitelisted, props]);

  const handleVerification = () => {
    setIsVerifying(true);
    try {
      IDENTITY_CLIENT.startVerification();
    } catch (error) {
      console.error("Error during identity verification:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div>
      {!auth && !isWalletChecked && (
        <Button
          disabled={!props.address}
          onClick={() => void configIdentityClient()}
          isLoading={isAuthenticating}
        >
          Authenticate
        </Button>
      )}
      {!auth && isAuthenticating && <Button isLoading>-</Button>}
      {auth &&
        isWalletWhitelisted &&
        isWalletChecked &&
        (isIdentityClientInit ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              onClick={handleVerification}
              id="identity-btn"
              isLoading={isVerifying}
            >
              1 - Begin identity verification
            </Button>
          </div>
        ) : (
          "Awaiting identity client initialization..."
        ))}
    </div>
  );
};
