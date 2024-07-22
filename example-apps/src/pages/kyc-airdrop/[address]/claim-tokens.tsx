import dynamic from "next/dynamic";
import React, { useState } from "react";
import { KYCLayout } from "@/features/kyc-airdrop/ui/KYCLayout";
import { Button } from "@/features/kyc-airdrop/ui/components/Button";
import { IDENTITY_CLIENT } from "@/features/kyc-widget/IdentityClient";
import { useWalletClient } from "wagmi";
import { type ClaimResponse } from "@/features/kyc-airdrop/utils/blockchain.schema";
import { useClaimToken } from "@/features/kyc-airdrop/utils/useClaimToken";
import { useRouter } from "next/router";

const KYCAirdropPageWrapper = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const { data: walletClient } = useWalletClient();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sdkResponse, setSdkResponse] = useState<ClaimResponse | undefined>(
    undefined,
  );
  const tryClaiming = useClaimToken();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

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
            if (_sdkResponse?.signatureResponse.isAuthorized === false) {
              handleClaimError(
                "You were not authorized to claim tokens, please go throught KYC before claiming",
              );
            } else {
              handleClaimError(
                _sdkResponse?.error
                  ? _sdkResponse.error
                  : "Error while claiming tokens",
              );
            }
          }
        })
        .catch((e) => {
          setIsLoading(false);
          console.log("error while fetching signature", e);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          handleClaimError(e);
        });
    } else {
      console.log("walletClient not loaded");
    }
  };

  const handleClaimSuccess = () => {
    void router.push({
      pathname: "/kyc-airdrop/[address]/claim-success",
      query: {
        address: router.query.address,
      },
    });
  };

  const handleClaimError = (error: string) => {
    void router.push({
      pathname: "/kyc-airdrop/[address]/error",
      query: {
        address: router.query.address,
        error,
      },
    });
  };

  return (
    <KYCLayout
      title={"Almost there"}
      subtitle="Now we need to verify your identity before you can claim tokens"
    >
      <div className="flex w-full flex-row items-center justify-center gap-4">
        <Button
          variant="secondary"
          onClick={handleVerification}
          id="identity-btn"
          isLoading={isVerifying}
        >
          1 - Begin identity verification
        </Button>
        <Button
          variant="secondary"
          disabled={!walletClient}
          onClick={handleClaimWallet}
          id="identity-btn"
          isLoading={isVerifying || isLoading}
        >
          2 - Claim tokens
        </Button>
      </div>
    </KYCLayout>
  );
};

const DynamicKYCAirdropPageWrapper = dynamic(
  () => Promise.resolve(KYCAirdropPageWrapper),
  { ssr: false },
);

export default function AllocationCheck() {
  return <DynamicKYCAirdropPageWrapper />;
}
