import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import type { Address } from "@nexeraprotocol/identity-schemas";
import { AirdropLayout } from "@/features/kyc-airdrop/ui/AirdropLayout";
import { getUserAllowance } from "@/features/kyc-airdrop/utils/getUserAllowance";
import { Button } from "@/features/kyc-airdrop/ui/components/Button";
import { useRouter } from "next/router";
import { useAccount, useSignMessage } from "wagmi";
import { ConnectButtonCustom } from "@/features/kyc-airdrop/ui/components/ConnectButtonCustom";
import { IDENTITY_CLIENT } from "@/features/kyc-widget/IdentityClient";
import { buildSignatureMessage } from "@nexeraid/identity-sdk";
import { fetchAccessToken } from "@/utils/fetchAccessToken";
import { useWalletCheck } from "@/features/kyc-airdrop/hooks/useWalletCheck";

const AirdropPageWrapper = () => {
  const [did, setDID] = useState<string | undefined>(undefined);
  const [allocation, setAllocation] = useState<number | undefined>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isIdentityClientInit, setIsIdentityClientInit] = useState(false);
  const [auth, setAuth] = useState<{
    accessToken: string;
    signingMessage: string;
    signature: string;
  }>();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const signMessage = useSignMessage();

  const { isConnected, address: connectedAddress } = useAccount();
  const { handleTryAnotherWallet } = useWalletCheck();
  const router = useRouter();
  const address = router.query.address as string;

  const signMessageAsync = useCallback(
    async (message: string) => {
      return await signMessage.signMessageAsync({ message });
    },
    [signMessage],
  );

  const blockchainNamespace = "eip155";

  const handleClaimWallet = useCallback(() => {
    void router.push({
      pathname: "/kyc-airdrop/[address]/claim-tokens",
      query: {
        address,
        did,
      },
    });
  }, [router, address, did]);

  const configIdentityClient = useCallback(async () => {
    console.log("Configuring identity client to check : ", address);
    if (address) {
      setIsAuthenticating(true);
      try {
        IDENTITY_CLIENT.onSignMessage(async (data) => {
          return await signMessageAsync(data.message);
        });
        const signingMessage = buildSignatureMessage(address);
        const signature = await signMessageAsync(signingMessage);
        const response = await fetchAccessToken(
          {
            address,
            blockchainNamespace,
          },
          "kyc-airdrop",
        );
        const accessToken = response.accessToken;
        IDENTITY_CLIENT.onSdkReady((data) => {
          setDID(data.did);
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
  }, [address, signMessageAsync]);

  useEffect(() => {
    if (
      isConnected &&
      connectedAddress &&
      connectedAddress !== router.query.address
    ) {
      void router.push({
        pathname: "/kyc-airdrop/[address]/allocation-check",
        query: {
          address: connectedAddress,
        },
      });
    }
    if (address) {
      setAllocation(getUserAllowance(address as Address));
    }
  }, [address, isConnected, connectedAddress, router]);

  return (
    <AirdropLayout
      title={
        allocation !== undefined
          ? allocation > 0
            ? "You scored allocation!"
            : "No allocation"
          : "This wallet doesn't qualify"
      }
      subtitle={
        allocation !== undefined
          ? allocation > 0
            ? `Congrats, the allocation for the wallet ${address} is ${allocation} PEAQ`
            : `Unfortunately, there is no allocation for the wallet ${address}`
          : `Unfortunately, the wallet ${address} doesn't qualify for some reason`
      }
    >
      <div className="flex flex-row items-center justify-center gap-4">
        {!!allocation && (
          <>
            <Button
              variant="primary"
              onClick={() => void handleTryAnotherWallet()}
            >
              Check another wallet
            </Button>
            {!isConnected && (
              <ConnectButtonCustom label="Connect wallet" variant="secondary" />
            )}
            {isConnected && !auth && (
              <Button
                variant="secondary"
                onClick={() => void configIdentityClient()}
                isLoading={isAuthenticating}
              >
                Authenticate wallet to start claiming
              </Button>
            )}
            {isIdentityClientInit && isConnected && auth && (
              <Button
                variant="secondary"
                onClick={() => void handleClaimWallet()}
              >
                Claim tokens
              </Button>
            )}
          </>
        )}
        {(allocation === undefined || allocation === 0) && (
          <Button
            variant="secondary"
            onClick={() => void handleTryAnotherWallet()}
          >
            Try another wallet
          </Button>
        )}
      </div>
    </AirdropLayout>
  );
};

const DynamicAirdropPageWrapper = dynamic(
  () => Promise.resolve(AirdropPageWrapper),
  { ssr: false },
);

export default function AllocationCheck() {
  return <DynamicAirdropPageWrapper />;
}
