import dynamic from "next/dynamic";
import { Client } from "../features/kyc/Client";

export default dynamic(() => Promise.resolve(Client), { ssr: false });
