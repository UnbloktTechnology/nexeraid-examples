import dynamic from "next/dynamic";
import { KYCAirdropPageWrapper } from "@/features/kyc-airdrop/KYCAirdropPageWrapper";

export default dynamic(() => Promise.resolve(KYCAirdropPageWrapper), {
  ssr: false,
});
