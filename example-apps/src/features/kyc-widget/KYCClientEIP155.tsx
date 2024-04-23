import { useAccount } from "wagmi";
import { IdentityFlow } from "./IdentityFlow";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const KYCClientEIP155 = (props: { setDID: (did: string) => void }) => {
  const account = useAccount();
  return (
    <>
      <ConnectButton />
      {account && <IdentityFlow setDID={props.setDID} />}
    </>
  );
};
