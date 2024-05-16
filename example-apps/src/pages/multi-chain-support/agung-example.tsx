import dynamic from "next/dynamic";
import { AgungSupportPage } from "@/features/apps/multi-chain-support/pages/AgungSupportPage";

export default dynamic(() => Promise.resolve(AgungSupportPage), {
  ssr: false,
});
