import { useEffect, useState } from "react";
import { useAccount, useContractWrite, useWalletClient } from "wagmi";
import {
  ExampleGatedNFTMinterABI,
  ExampleNFTMinterABI,
} from "@nexeraprotocol/nexera-id-contracts-sdk/abis";
import {
  ExampleGatedNFTMinterAddress_mumbai_dev,
  ExampleNFTMinterAddress_mumbai_dev,
} from "@nexeraprotocol/nexera-id-contracts-sdk/addresses";
import type { MintResponse } from "./blockchain-components/blockchain.schema";
import {
  useGetGatedMintedNFTs,
  useGetNonGatedMintedNFTs,
} from "./blockchain-components/useGetMintedNFTs";
import { useMintGatedNFTFromSDK } from "./blockchain-components/useMintNFT";
import { publicActions } from "viem";
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

  const [sdkResponse, setSdkResponse] = useState<MintResponse | undefined>(
    undefined,
  );
  const [sdkGatedMintCost, setSdkGatedMintCost] = useState<number | undefined>(
    undefined,
  );
  const [nonGatedMintCost, setNonGatedMintCost] = useState<number | undefined>(
    undefined,
  );
  // sdk contract call gated nft
  const {
    data: sdkWriteData,
    isLoading: isLoadingSdk,
    isSuccess: isSuccessSdk,
    error: errorSdk,
    write: writeSdk,
  } = useContractWrite({
    address: ExampleGatedNFTMinterAddress_mumbai_dev,
    abi: ExampleGatedNFTMinterABI,
    functionName: "mintNFTGated",
  });
  // sdk contract call NON gated nft
  const {
    data: writeDataNonGated,
    isLoading: isLoadingNonGated,
    isSuccess: isSuccessNonGated,
    write: writeNonGated,
  } = useContractWrite({
    address: ExampleNFTMinterAddress_mumbai_dev,
    abi: ExampleNFTMinterABI,
    functionName: "mintNFT",
  });
  const mintedGatedNFTs = useGetGatedMintedNFTs();
  const mintedNonGatedNFTs = useGetNonGatedMintedNFTs();

  const tryMintingGatedNFTFromSDK = useMintGatedNFTFromSDK();

  // update gasCost for sdk tx hash
  useEffect(() => {
    if (walletClient && sdkWriteData?.hash) {
      walletClient
        .extend(publicActions)
        .waitForTransactionReceipt({
          hash: sdkWriteData.hash,
        })
        .then((rcpt) => {
          setSdkGatedMintCost(Number(rcpt.gasUsed));
        })
        .catch((e) => {
          console.log("error fetdcging gas cost for sdk response", e);
        });
    }
  }, [sdkWriteData, walletClient]);

  // update gasCost for non gated call tx hash
  useEffect(() => {
    if (walletClient && writeDataNonGated?.hash) {
      walletClient
        .extend(publicActions)
        .waitForTransactionReceipt({
          hash: writeDataNonGated.hash,
        })
        .then((rcpt) => {
          setNonGatedMintCost(Number(rcpt.gasUsed));
        })
        .catch((e) => {
          console.log("error fetdcging gas cost for sdk response", e);
        });
    }
  }, [writeDataNonGated, walletClient]);

  return (
    <>
      <div>DID:{did}</div>
      {!did && <div>Waiting for Polygon Wallet instantiation...</div>}
      {did && (
        <>
          <div className="m-2 border border-black p-4">
            <h1 className={"text-3xl font-bold"}>Gated NFTs</h1>
            <br />
            <button
              style={buttonStyle}
              id="mint-sdk-btn"
              disabled={!walletClient}
              onClick={() => {
                if (walletClient) {
                  tryMintingGatedNFTFromSDK
                    .mutateAsync({
                      client: walletClient.extend(publicActions),
                      write: writeSdk,
                    })
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
              Mint Gated NFT With SDK Call
            </button>
            <h2 className={"text-2xl font-bold"}>SDK RESPONSE</h2>
            <DisplayMintResponse
              mintResponse={sdkResponse}
              gasCost={sdkGatedMintCost}
              writeData={{
                isLoading: isLoadingSdk,
                isSuccess: isSuccessSdk,
              }}
              error={errorSdk?.toString().substring(0, 108)}
            />
            <br />
            <DisplayMintedNFTs
              mintedNFTs={mintedGatedNFTs.nfts ?? []}
              title={"Minted Gated NFTs: "}
            />
          </div>
          <br />
          <div className="m-2 border border-black p-4">
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
                  writeNonGated({ args: [account.address] });
                } else {
                  console.log("walletClient not loaded");
                }
              }}
            >
              Mint Gated NFT With SDK Call
            </button>
            <h2 className={"text-2xl font-bold"}>Gas Cost</h2>
            {nonGatedMintCost && <div>Gas Cost: {nonGatedMintCost}</div>}
            {writeDataNonGated && (
              <div>
                Transaction Status:{" "}
                {isLoadingNonGated
                  ? "Loading..."
                  : isSuccessNonGated
                    ? "Success"
                    : "Failed"}
              </div>
            )}
            <br />
            <DisplayMintedNFTs
              mintedNFTs={mintedNonGatedNFTs.nfts ?? []}
              title={"Minted NON Gated NFTs: "}
            />
          </div>
        </>
      )}
    </>
  );
};
