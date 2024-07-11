import dynamic from "next/dynamic";
import { KYCAirdropPage } from "@/features/kyc-airdrop/KYCAirdropPage";

export default dynamic(() => Promise.resolve(KYCAirdropPage), { ssr: false });
