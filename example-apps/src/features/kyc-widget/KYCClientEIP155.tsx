import { useAccount, useSignMessage } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { IdentityFlowAirdrop } from "./IdentityFlowAirdrop";
import { useEffect } from "react";
import { useKYCContext } from "../kyc-airdrop/providers/KYCContext";

export const KYCClientEIP155 = (props: { setDID: (did: string) => void }) => {
  const signMessage = useSignMessage();
  const { address } = useAccount();

  const { isWalletChecked, resetKYCContext } = useKYCContext();

  useEffect(() => {
    if (!address && isWalletChecked) {
      resetKYCContext();
    }
  }, [address, isWalletChecked, resetKYCContext]);

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
