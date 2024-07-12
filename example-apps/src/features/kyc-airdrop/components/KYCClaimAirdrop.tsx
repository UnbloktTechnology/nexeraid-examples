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
  const { isWalletWhitelisted, isWalletChecked, setIsWalletFailedClaim } =
    useKYCContext();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {did && isWalletChecked && isWalletWhitelisted && (
        <div className="flex flex-col gap-4">
          {sdkResponse?.signatureResponse.isAuthorized === false && (
            <p>You need to go through KYC before you can claim</p>
          )}
          <Button
            id="mint-sdk-btn"
            disabled={!walletClient}
            isLoading={isLoading}
            onClick={() => {
              if (walletClient) {
                setIsLoading(true);
                tryClaiming
                  .mutateAsync()
                  .then((_sdkResponse) => {
                    setIsLoading(false);
                    setSdkResponse(_sdkResponse);
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
            2 - Connect wallet address to claim
          </Button>
        </div>
      )}
    </>
  );
};
