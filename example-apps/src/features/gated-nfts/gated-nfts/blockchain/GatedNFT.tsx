import { useState } from "react";
import {
  useAccount,
  useContractWrite,
  useWalletClient,
  useChainId,
  useWaitForTransaction,
} from "wagmi";
import { sepolia } from "viem/chains";
import { ExampleNFTMinterABI } from "@nexeraprotocol/nexera-id-contracts-sdk/abis";
import {
  ExampleNFTMinterAddress_mumbai_dev,
  ExampleNFTMinterAddress_sepolia_dev,
} from "@nexeraprotocol/nexera-id-contracts-sdk/addresses";
import type { MintResponse } from "./blockchain-components/blockchain.schema";
import {
  useGetGatedMintedNFTs,
  useGetNonGatedMintedNFTs,
} from "./blockchain-components/useGetMintedNFTs";
import { useMintGatedNFTFromSDK } from "./blockchain-components/useMintNFT";

import { DisplayMintResponse } from "./blockchain-components/DisplayMintResponse";
import { DisplayMintedNFTs } from "./blockchain-components/DisplayMintedNFTs";

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
  const mintGatedSdkTxResult = useWaitForTransaction({
    hash: tryMintingGatedNFTFromSDK.data?.txHash ?? "0x0",
    enabled: !!tryMintingGatedNFTFromSDK.data?.txHash,
  });

  // sdk contract call NON gated nft
  const mintNonGated = useContractWrite({
    address:
      chainId == sepolia.id
        ? ExampleNFTMinterAddress_sepolia_dev
        : ExampleNFTMinterAddress_mumbai_dev,
    abi: ExampleNFTMinterABI,
    functionName: "mintNFT",
  });
  const mintNonGatedTxResult = useWaitForTransaction({
    hash: mintNonGated.data?.hash ?? "0x0",
    enabled: !!mintNonGated.data?.hash,
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
                isLoading: tryMintingGatedNFTFromSDK.isLoading,
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
                  mintNonGated.write({
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
              {mintNonGatedTxResult.isLoading
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
