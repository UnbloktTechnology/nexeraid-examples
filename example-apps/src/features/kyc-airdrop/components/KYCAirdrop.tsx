import { useState } from "react";
import { useWalletClient } from "wagmi";
import type { MintResponse } from "../utils/blockchain.schema";
import { useClaimToken } from "../utils/useClaimToken";
import { useKYCContext } from "../providers/KYCContext";
import { Icon } from "@/features/bank-web3/Components/Icon";

export const KYCAirdrop = (props: { did: string | undefined }) => {
  const { did } = props;
  const { data: walletClient } = useWalletClient();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sdkResponse, setSdkResponse] = useState<MintResponse | undefined>(
    undefined,
  );
  const tryClaiming = useClaimToken();
  const { isWalletWhitelisted, isWalletChecked } = useKYCContext();

  return (
    <>
      {did && isWalletChecked && isWalletWhitelisted && (
        <button
          className="rounded-full bg-white px-4 py-2 font-medium text-black shadow hover:bg-gray-100"
          id="mint-sdk-btn"
          disabled={!walletClient}
          onClick={() => {
            if (walletClient) {
              tryClaiming
                .mutateAsync()
                .then((_sdkResponse) => {
                  setSdkResponse(_sdkResponse);
                })
                .catch((e) => {
                  console.log("error while fetching signature", e);
                });
            } else {
              console.log("walletClient not loaded");
            }
          }}
        >
          <Icon icon="spinner" size={18} color="black" />
          Claim to connect wallet address
        </button>
      )}
      {isWalletChecked && !isWalletWhitelisted && (
        <div className="m-4 w-full p-4">
          <h2 className="text-2xl font-bold">
            You are not authorized, try to connect another wallet
          </h2>
        </div>
      )}
    </>
  );
};
