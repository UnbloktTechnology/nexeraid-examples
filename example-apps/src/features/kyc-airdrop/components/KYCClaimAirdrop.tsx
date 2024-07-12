import { useState } from "react";
import { useWalletClient } from "wagmi";
import type { ClaimResponse } from "../utils/blockchain.schema";
import { useClaimToken } from "../utils/useClaimToken";
import { useKYCContext } from "../providers/KYCContext";
import { Button } from "./Button";

export const KYCClaimAirdrop = (props: { did: string | undefined }) => {
  const { did } = props;
  const { data: walletClient } = useWalletClient();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sdkResponse, setSdkResponse] = useState<ClaimResponse | undefined>(
    undefined,
  );
  const tryClaiming = useClaimToken();
  const {
    isWalletWhitelisted,
    isWalletChecked,
    setIsWalletFailedClaim,
    setIsWalletClaimed,
  } = useKYCContext();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {did && isWalletChecked && isWalletWhitelisted && (
        <div>
          {sdkResponse?.signatureResponse.isAuthorized === false && (
            <div>You need to go through KYC before you can claim</div>
          )}
          <Button
            className="rounded-full bg-white px-4 py-2 font-medium text-black shadow hover:bg-gray-100"
            id="mint-sdk-btn"
            disabled={
              !walletClient ||
              sdkResponse?.signatureResponse.isAuthorized === false
            }
            isLoading={isLoading}
            onClick={() => {
              if (walletClient) {
                setIsLoading(true);
                tryClaiming
                  .mutateAsync()
                  .then((_sdkResponse) => {
                    setIsLoading(false);
                    setSdkResponse(_sdkResponse);
                    setIsWalletClaimed(true);
                  })
                  .catch((e) => {
                    setIsLoading(false);
                    console.log("error while fetching signature", e);
                    setIsWalletFailedClaim(true);
                  });
              } else {
                console.log("walletClient not loaded");
              }
            }}
          >
            2 - Claim to connect wallet address
          </Button>
        </div>
      )}
    </>
  );
};
