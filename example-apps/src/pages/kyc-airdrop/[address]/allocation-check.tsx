import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import type { Address } from "@nexeraid/identity-schemas";
import { AirdropLayout } from "@/features/kyc-airdrop/ui/AirdropLayout";
import { getUserAllowance } from "@/features/kyc-airdrop/utils/getUserAllowance";
import { Button } from "@/features/kyc-airdrop/ui/components/Button";
import { useRouter } from "next/router";
import { useAccount, useSignMessage, useWalletClient } from "wagmi";
import { ConnectButtonCustom } from "@/features/kyc-airdrop/ui/components/ConnectButtonCustom";
import { IDENTITY_CLIENT } from "@/features/kyc-widget/IdentityClient";
import { buildSignatureMessage } from "@nexeraid/identity-sdk";
import { fetchAccessToken } from "@/utils/fetchAccessToken";
import { useWalletCheck } from "@/features/kyc-airdrop/hooks/useWalletCheck";
import { type ClaimResponse } from "@/features/kyc-airdrop/utils/blockchain.schema";
import { useClaimToken } from "@/features/kyc-airdrop/utils/useClaimToken";
import { useGetCustomerStatusByProjectIdAndWallet } from "@/features/kyc-airdrop/hooks/useGetCustomerStatusByProjectIdAndWallet";

const AirdropPageWrapper = () => {
  const [did, setDID] = useState<string | undefined>(undefined);
  const [allocation, setAllocation] = useState<number | undefined>(0);
  const [isIdentityClientInit, setIsIdentityClientInit] = useState(false);
  const [auth, setAuth] = useState<{
    accessToken: string;
    signingMessage: string;
    signature: string;
  }>();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCustomerActive, setIsCustomerActive] = useState(false);
  const [sdkResponse, setSdkResponse] = useState<ClaimResponse | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(false);

  const { isConnected, address: connectedAddress } = useAccount();
  const { handleTryAnotherWallet } = useWalletCheck();
  const router = useRouter();
  const tryClaiming = useClaimToken();
  const signMessage = useSignMessage();
  const { data: walletClient } = useWalletClient();

  const address = router.query.address as string;

  const customerStatus = useGetCustomerStatusByProjectIdAndWallet(
    address as Address,
    isCustomerActive,
  );
  useEffect(() => {
    setIsCustomerActive(customerStatus.data?.status === "Active");
  }, [customerStatus.data]);

  const signMessageAsync = useCallback(
    async (message: string) => {
      return await signMessage.signMessageAsync({ message });
    },
    [signMessage],
  );

  const blockchainNamespace = "eip155";

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

  // Handle identity verification
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

  // Handle token claim
  const handleClaimWallet = () => {
    if (walletClient) {
      setIsLoading(true);
      tryClaiming
        .mutateAsync()
        .then((_sdkResponse) => {
          setIsLoading(false);
          setSdkResponse(_sdkResponse);
          console.log("sdkResponse", _sdkResponse.signatureResponse);

          if (_sdkResponse?.signatureResponse.isAuthorized) {
            handleClaimSuccess();
          } else {
            handleClaimError(
              _sdkResponse?.error ??
                "You are not authorized to claim tokens, please retry the identity verification process",
            );
          }
        })
        .catch((e) => {
          setIsLoading(false);
          console.error("Error while fetching signature", e);
          handleClaimError("Error while fetching signature");
        });
    } else {
      console.log("walletClient not loaded");
    }
  };

  const handleClaimSuccess = () => {
    void router.push({
      pathname: "/kyc-airdrop/[address]/claim-success",
      query: { address: router.query.address },
    });
  };

  const handleClaimError = (error: string) => {
    void router.push({
      pathname: "/kyc-airdrop/[address]/error",
      query: { address: router.query.address, error },
    });
  };

  const renderKycButton = () => {
    return (
      !isCustomerActive && (
        <Button
          variant="secondary"
          onClick={handleVerification}
          disabled={isVerifying}
          id="identity-btn"
          isLoading={isVerifying}
        >
          Begin identity verification
        </Button>
      )
    );
  };

  const renderClaimButton = () => {
    return (
      isCustomerActive && (
        <Button
          variant="secondary"
          disabled={!walletClient || isLoading}
          onClick={handleClaimWallet}
          id="claim-btn"
          isLoading={isLoading}
        >
          Claim tokens
        </Button>
      )
    );
  };

  const renderKycAndClaim = () => {
    return customerStatus.isLoading ? (
      <Button variant="secondary" isLoading>
        Please wait
      </Button>
    ) : (
      <>
        {renderKycButton()}
        {renderClaimButton()}
      </>
    );
  };

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

  const renderTitle = () => {
    if (allocation !== undefined) {
      return allocation > 0 ? "You scored allocation!" : "No allocation";
    } else {
      return "This wallet doesn't qualify";
    }
  };

  const renderSubtitle = () => {
    if (allocation !== undefined) {
      if (allocation > 0) {
        if (auth) {
          if (isCustomerActive) {
            return "You can claim tokens now";
          } else {
            return "Now we need to verify your identity before you can claim tokens";
          }
        } else
          return `Congrats, the allocation for the wallet ${address} is ${allocation} PEAQ.`;
      } else {
        `Unfortunately, there is no allocation for the wallet ${address}`;
      }
      return allocation > 0
        ? `Congrats, the allocation for the wallet ${address} is ${allocation} PEAQ`
        : `Unfortunately, there is no allocation for the wallet ${address}`;
    } else {
      return `Unfortunately, the wallet ${address} doesn't qualify`;
    }
  };

  return (
    <AirdropLayout title={renderTitle()} subtitle={renderSubtitle()}>
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
            {isIdentityClientInit && isConnected && auth && renderKycAndClaim()}
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
