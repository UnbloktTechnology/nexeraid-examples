import dynamic from "next/dynamic";
import { PolkadotSupportPage } from "@/features/apps/multi-chain-support/pages/PolkadotSupportPage";

export default dynamic(() => Promise.resolve(PolkadotSupportPage), {
  ssr: false,
});
