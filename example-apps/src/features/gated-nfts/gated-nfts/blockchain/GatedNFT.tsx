import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWalletClient,
  useChainId,
  useWaitForTransactionReceipt,
} from "wagmi";

import { ExampleNFTMinterABI } from "@nexeraprotocol/nexera-id-sig-gating-contracts-sdk/abis";

import type { MintResponse } from "./blockchain-components/blockchain.schema";
import {
  useGetGatedMintedNFTs,
  useGetNonGatedMintedNFTs,
} from "./blockchain-components/useGetMintedNFTs";
import { useMintGatedNFTFromSDK } from "./blockchain-components/useMintNFT";

import { DisplayMintResponse } from "./blockchain-components/DisplayMintResponse";
import { DisplayMintedNFTs } from "./blockchain-components/DisplayMintedNFTs";
import { getNonGatedContractAddress } from "./blockchain-components/getContractAddress";
import { ChainId } from "@nexeraprotocol/identity-schemas";

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

export const GatedNFT = (props: { did: string | undefined }) => {
  const { did } = props;
  const { data: walletClient } = useWalletClient();
  const account = useAccount();
  const chainId = useChainId();

  const [sdkResponse, setSdkResponse] = useState<MintResponse | undefined>(
    undefined,
  );

  const mintedGatedNFTs = useGetGatedMintedNFTs();
  const mintedNonGatedNFTs = useGetNonGatedMintedNFTs();

  const tryMintingGatedNFTFromSDK = useMintGatedNFTFromSDK();
  const mintGatedSdkTxResult = useWaitForTransactionReceipt({
    hash: tryMintingGatedNFTFromSDK.data?.txHash ?? "0x0",
    query: { enabled: !!tryMintingGatedNFTFromSDK.data?.txHash },
  });

  // sdk contract call NON gated nft
  const mintNonGated = useWriteContract();
  const mintNonGatedTxResult = useWaitForTransactionReceipt({
    hash: mintNonGated.data ?? "0x0",
    query: { enabled: !!mintNonGated.data },
  });
  return (
    <>
      <div>DID:{did}</div>
      {!did && <div>Waiting for Polygon Wallet instantiation...</div>}
      {did && (
        <>
          <div className="m-4 w-full border border-black p-4">
            <h1 className={"text-3xl font-bold"}>Gated NFTs</h1>
            <br />
            <button
              style={buttonStyle}
              id="mint-sdk-btn"
              disabled={!walletClient}
              onClick={() => {
                if (walletClient) {
                  tryMintingGatedNFTFromSDK
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
              Mint Gated NFT
            </button>
            <br />
            <h2 className={"mt-4 text-2xl font-bold"}>SDK RESPONSE</h2>
            <DisplayMintResponse
              mintResponse={sdkResponse}
              gasCost={mintGatedSdkTxResult.data?.gasUsed}
              writeData={{
                isLoading: tryMintingGatedNFTFromSDK.isPending,
                isSuccess: tryMintingGatedNFTFromSDK.isSuccess,
              }}
              error={tryMintingGatedNFTFromSDK.data?.error}
            />
            <br />
            <DisplayMintedNFTs
              mintedNFTs={mintedGatedNFTs.nfts}
              newNFTs={mintedGatedNFTs.newNFTs}
              title={"Minted Gated NFTs: "}
            />
          </div>
          <br />
          <div className="m-2 w-full border border-black p-4">
            <h1 className={"text-3xl font-bold"}>
              Non Gated NFTs for comparaison
            </h1>
            <br />
            <button
              style={buttonStyle}
              id="mint-non-gated-btn"
              disabled={!walletClient}
              onClick={() => {
                if (!walletClient || !account.address) {
                  console.log("No walletClient or account");
                  return;
                }
                if (walletClient) {
                  mintNonGated.writeContract({
                    address: getNonGatedContractAddress(ChainId.parse(chainId)),
                    abi: ExampleNFTMinterABI,
                    functionName: "mintNFT",
                    args: [account.address],
                  });
                } else {
                  console.log("walletClient not loaded");
                }
              }}
            >
              Mint Non Gated NFT
            </button>

            <h2 className={"text-2xl font-bold"}>Gas Cost</h2>
            {mintNonGatedTxResult.data?.gasUsed
              ? mintNonGatedTxResult.data.gasUsed.toString()
              : "Pending"}
            <div>
              Transaction Status:{" "}
              {mintNonGatedTxResult.isPending
                ? "Loading..."
                : mintNonGatedTxResult.isSuccess
                  ? "Success"
                  : "Failed"}
            </div>
            <br />
            <DisplayMintedNFTs
              mintedNFTs={mintedNonGatedNFTs.nfts}
              title={"Minted NON Gated NFTs: "}
              newNFTs={mintedNonGatedNFTs.newNFTs}
            />
          </div>
        </>
      )}
    </>
  );
};
