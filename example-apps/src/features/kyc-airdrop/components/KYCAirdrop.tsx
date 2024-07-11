import { useState } from "react";
import { useWalletClient } from "wagmi";
import type { MintResponse } from "../utils/blockchain.schema";
import { useClaimToken } from "../utils/useClaimToken";
import { useKYCContext } from "../providers/KYCContext";
import { Button } from "./Button";

export const KYCAirdrop = (props: { did: string | undefined }) => {
  const { did } = props;
  const { data: walletClient } = useWalletClient();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sdkResponse, setSdkResponse] = useState<MintResponse | undefined>(
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
        <Button
          className="rounded-full bg-white px-4 py-2 font-medium text-black shadow hover:bg-gray-100"
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
      )}
    </>
  );
};
