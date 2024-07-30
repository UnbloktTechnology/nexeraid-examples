import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { AirdropLayout } from "@/features/kyc-airdrop/ui/AirdropLayout";
import { Button } from "@/features/kyc-airdrop/ui/components/Button";
import { IDENTITY_CLIENT } from "@/features/kyc-widget/IdentityClient";
import { useWalletClient } from "wagmi";
import { type ClaimResponse } from "@/features/kyc-airdrop/utils/blockchain.schema";
import { useClaimToken } from "@/features/kyc-airdrop/utils/useClaimToken";
import { useRouter } from "next/router";
import { useGetCustomerStatusByProjectIdAndWallet } from "@/features/kyc-airdrop/hooks/useGetCustomerStatusByProjectIdAndWallet";
import { type Address } from "@nexeraid/identity-schemas";

const AirdropPageWrapper = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const { data: walletClient } = useWalletClient();
  const router = useRouter();
  const address = router.query.address as string;
  const [isCustomerActive, setIsCustomerActive] = useState(false);
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

  const customerStatus = useGetCustomerStatusByProjectIdAndWallet(
    address as Address,
    isCustomerActive,
  );
  useEffect(() => {
    setIsCustomerActive(customerStatus.data?.status === "Active");
  }, [customerStatus.data]);

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
      <Button
        variant="secondary"
        onClick={handleVerification}
        disabled={isVerifying || isCustomerActive}
        id="identity-btn"
        isLoading={isVerifying}
      >
        {isCustomerActive ? "Identify verified" : "Begin identity verification"}
      </Button>
    );
  };

  const renderClaimButton = () => {
    return (
      <Button
        variant="secondary"
        disabled={!walletClient || isLoading || !isCustomerActive}
        onClick={handleClaimWallet}
        id="claim-btn"
        isLoading={isLoading}
      >
        {isCustomerActive
          ? "Claim tokens"
          : "Waiting for identity verification"}
      </Button>
    );
  };

  return (
    <AirdropLayout
      title={"Almost there"}
      subtitle="Now we need to verify your identity before you can claim tokens"
    >
      <div className="flex w-full flex-row items-center justify-center gap-4">
        {customerStatus.isLoading ? (
          <Button variant="secondary" isLoading>
            Please wait
          </Button>
        ) : (
          <>
            {renderKycButton()}
            {renderClaimButton()}
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
