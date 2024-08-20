import { useState } from "react";

import { DisplayMintedNFTs } from "./DisplayMintedNFTs";
import { useGetGatedMintedNFTsTezos } from "../utils/tezos/useGetMintedNFTsTezos";
import { useMintGatedNFTTezos } from "../utils/tezos/useMintNFTTezos";
import { DisplayMintTezosResponse } from "./DisplayMintResponseTezos";
import type { MintTezosResponse } from "../utils/tezos/tezos.schema";

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

export const GatedNFTTezos = (props: { did: string | undefined }) => {
  const { did } = props;

  const [sdkResponse, setSdkResponse] = useState<MintTezosResponse | undefined>(
    undefined,
  );

  const mintedGatedNFTs = useGetGatedMintedNFTsTezos();
  const mintGatedNFT = useMintGatedNFTTezos();

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
              disabled={!did}
              onClick={() => {
                mintGatedNFT
                  .mutateAsync()
                  .then((_sdkResponse) => {
                    setSdkResponse(_sdkResponse);
                  })
                  .catch((e) => {
                    console.log("error while fetching signature", e);
                  });
              }}
            >
              Mint Gated NFT
            </button>
            <br />
            <h2 className={"mt-4 text-2xl font-bold"}>SDK RESPONSE</h2>
            <DisplayMintTezosResponse
              mintResponse={sdkResponse}
              writeData={{
                isLoading: mintGatedNFT.isPending,
                isSuccess: mintGatedNFT.isSuccess,
              }}
              error={mintGatedNFT.data?.error}
            />
            <br />
            <DisplayMintedNFTs
              mintedNFTs={mintedGatedNFTs.data ?? []}
              newNFTs={[]}
              title={"Minted Gated NFTs: "}
            />
          </div>
        </>
      )}
    </>
  );
};
