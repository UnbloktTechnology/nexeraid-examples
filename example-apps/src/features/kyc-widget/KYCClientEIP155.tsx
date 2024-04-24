import { useAccount, useSignMessage } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { IdentityFlow } from "./IdentityFlow";

export const KYCClientEIP155 = (props: { setDID: (did: string) => void }) => {
  const signMessage = useSignMessage();
  const { address } = useAccount();
  return (
    <>
      <ConnectButton />
      {address && (
        <IdentityFlow
          setDID={props.setDID}
          signMessageAsync={async (message: string) => {
            return await signMessage.signMessageAsync({ message });
          }}
          address={address}
          blockchainNamespace={"eip155"}
        />
      )}
    </>
  );
};
