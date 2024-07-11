import { useAccount, useSignMessage } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { IdentityFlowAirdrop } from "./IdentityFlowAirdrop";

export const KYCClientEIP155 = (props: { setDID: (did: string) => void }) => {
  const signMessage = useSignMessage();
  const { address } = useAccount();
  return (
    <>
      <ConnectButton label="Connect the wallet" />
      {address && (
        <IdentityFlowAirdrop
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
