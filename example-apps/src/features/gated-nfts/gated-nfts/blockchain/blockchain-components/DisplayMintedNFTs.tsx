import { short0xString, type Address } from "@nexeraprotocol/nexera-id-schemas";

export const DisplayMintedNFTs = (props: {
  title: string;
  mintedNFTs: {
    from?: Address | undefined;
    owner?: Address | undefined;
    tokenId?: number | undefined;
  }[];
}) => {
  return (
    <div className="mt-2">
      <h2 className={"text-2xl font-bold"}>{props.title}</h2>
      <div className="m-2 h-64 overflow-y-auto border border-black p-4">
        {props.mintedNFTs?.toReversed().map((nft, i) => {
          return (
            <div key={i}>
              NFT #{nft.tokenId} Owner: {nft.owner && short0xString(nft.owner)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
