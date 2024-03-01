import dynamic from "next/dynamic";
import { GatedNFTPage } from "@/features/gated-nfts/gated-nfts/GatedNFTPage";

export default dynamic(() => Promise.resolve(GatedNFTPage), { ssr: false });
