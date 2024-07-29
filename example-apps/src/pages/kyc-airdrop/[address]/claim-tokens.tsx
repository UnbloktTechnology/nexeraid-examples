import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { AirdropLayout } from "@/features/kyc-airdrop/ui/AirdropLayout";
import { Button } from "@/features/kyc-airdrop/ui/components/Button";
import { IDENTITY_CLIENT } from "@/features/kyc-widget/IdentityClient";
import { useWalletClient } from "wagmi";
import { type ClaimResponse } from "@/features/kyc-airdrop/utils/blockchain.schema";
import { useClaimToken } from "@/features/kyc-airdrop/utils/useClaimToken";
import { useRouter } from "next/router";
import { useWalletCheck } from "@/features/kyc-airdrop/hooks/useWalletCheck";

const AirdropPageWrapper = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const { data: walletClient } = useWalletClient();
  const [kycCompletion, setKycCompletion] = useState(false);
  const router = useRouter();
  const address = router.query.address as string;
  const [customerStatus, setCustomerStatus] = useState<string | undefined>();
  const [customerStatusLoading, setCustomerStatusLoading] = useState(false);

  const { getCustomerStatus } = useWalletCheck();
  const [sdkResponse, setSdkResponse] = useState<ClaimResponse | undefined>(
    undefined,
  );
  const tryClaiming = useClaimToken();
  const [isLoading, setIsLoading] = useState(false);

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

  // Fetch customer status
  useEffect(() => {
    if (address && customerStatus === undefined && !customerStatusLoading) {
      setCustomerStatusLoading(true);
      getCustomerStatus(address)
        .then((response) => {
          setCustomerStatus(response.status);
          setCustomerStatusLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching customer status:", error);
          setCustomerStatusLoading(false); // Ensure loading state is reset even on error
        });
    }
  }, [address, customerStatus, customerStatusLoading, getCustomerStatus]);

  // Handle KYC events
  useEffect(() => {
    const onKycCompletion = () => {
      console.log("KYC COMPLETED");
      setKycCompletion(true);
    };

    const onCloseScreen = async () => {
      console.log("KYC CLOSED");
      setKycCompletion(true);
      return Promise.resolve("Screen closed");
    };

    IDENTITY_CLIENT.onKycCompletion(onKycCompletion);
    IDENTITY_CLIENT.onCloseScreen(onCloseScreen);
  }, []);

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

  const displayKycButton =
    !customerStatusLoading &&
    !kycCompletion &&
    customerStatus &&
    customerStatus !== "Active";
  const displayClaimButton =
    !customerStatusLoading || (customerStatus === "Active" && !kycCompletion);

  return (
    <AirdropLayout
      title={"Almost there"}
      subtitle="Now we need to verify your identity before you can claim tokens"
    >
      <div className="flex w-full flex-row items-center justify-center gap-4">
        {customerStatusLoading ? (
          <Button variant="secondary" isLoading>
            Please wait
          </Button>
        ) : (
          <>
            {displayKycButton && (
              <Button
                variant="secondary"
                onClick={handleVerification}
                disabled={isVerifying || kycCompletion}
                id="identity-btn"
                isLoading={isVerifying}
              >
                Begin identity verification
              </Button>
            )}
            {displayClaimButton && (
              <Button
                variant="secondary"
                disabled={!walletClient || isLoading}
                onClick={handleClaimWallet}
                id="claim-btn"
                isLoading={isLoading}
              >
                Claim tokens
              </Button>
            )}
          </>
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
