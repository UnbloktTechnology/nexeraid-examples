import dynamic from "next/dynamic";

export default dynamic(() => import("./component"), { ssr: false });
