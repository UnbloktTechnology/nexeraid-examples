import type { Address } from "@nexeraprotocol/nexera-id-schemas";

export const DisplayMintedNFTs = (props: {
  title: string;
  mintedNFTs: {
    from?: Address | undefined;
    owner?: Address | undefined;
    tokenId?: number | undefined;
  }[];
}) => {
  return (
    <div>
      <h2 className={"text-2xl font-bold"}>{props.title}</h2>
      {props.mintedNFTs?.map((nft, i) => {
        return (
          <div key={i}>
            NFT #{nft.tokenId} Owner: {nft.owner}
          </div>
        );
      })}
    </div>
  );
};
