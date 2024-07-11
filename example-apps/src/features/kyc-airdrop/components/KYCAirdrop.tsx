import { useState } from "react";
import { useWalletClient, useWaitForTransactionReceipt } from "wagmi";

import type { MintResponse } from "../utils/blockchain.schema";
import { useGetTokenBalance } from "../utils/useGetTokenBalance";
import { useClaimToken } from "../utils/useClaimToken";

import { DisplayApiResponse } from "./DisplayApiResponse";
import { DisplayTokenBalance } from "./DisplayTokenBalance";

const buttonStyle = {
  padding: "16px 24px",
  borderRadius: 16,
  cursor: "pointer",
  backgroundColor: "#0258FD",
  color: "white",
  fontWeight: "bold",
  fontSize: "16px",
  border: "none",
};

export const KYCAirdrop = (props: { did: string | undefined }) => {
  const { did } = props;
  const { data: walletClient } = useWalletClient();
  // const account = useAccount();
  // const chainId = useChainId();

  const [sdkResponse, setSdkResponse] = useState<MintResponse | undefined>(
    undefined,
  );

  const getBalance = useGetTokenBalance();

  const tryClaiming = useClaimToken();
  const claimTxResult = useWaitForTransactionReceipt({
    hash: tryClaiming.data?.txHash ?? "0x0",
    query: { enabled: !!tryClaiming.data?.txHash },
  });

  return (
    <>
      <div>DID:{did}</div>
      {!did && <div>Waiting for Polygon Wallet instantiation...</div>}
      {did && (
        <>
          <div className="m-4 w-full border border-black p-4">
            <h1 className={"text-3xl font-bold"}>KYC Gated Airdrop</h1>
            <br />
            <button
              style={buttonStyle}
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
              Claim Token
            </button>
            <br />
            <h2 className={"mt-4 text-2xl font-bold"}>SDK RESPONSE</h2>
            <DisplayApiResponse
              mintResponse={sdkResponse}
              gasCost={claimTxResult.data?.gasUsed}
              writeData={{
                isLoading: tryClaiming.isPending,
                isSuccess: tryClaiming.isSuccess,
              }}
              error={tryClaiming.data?.error}
            />
            <br />
            <DisplayTokenBalance
              balance={getBalance.balance ?? 0}
              title={"User balance: "}
            />
          </div>
          <br />
        </>
      )}
    </>
  );
};
