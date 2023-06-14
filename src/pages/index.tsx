import dynamic from "next/dynamic";

export default dynamic(() => import("../features/kyc/Client"), { ssr: false });
