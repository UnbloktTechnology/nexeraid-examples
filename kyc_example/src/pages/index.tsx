import dynamic from "next/dynamic";
import { Client } from "../features/identity/Client";

export default dynamic(() => Promise.resolve(Client), { ssr: false });
