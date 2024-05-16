import dynamic from "next/dynamic";
import { GatedNFTPage } from "@/features/apps/gated-nfts/GatedNFTPage";

export default dynamic(() => Promise.resolve(GatedNFTPage), { ssr: false });
