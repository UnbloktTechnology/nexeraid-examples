import dynamic from "next/dynamic";
import { GatedNFTPageTezos } from "@/features/gated-nfts/GatedNFTPageTezos";

export default dynamic(() => Promise.resolve(GatedNFTPageTezos), {
  ssr: false,
});
