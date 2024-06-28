import { IdentityFlow } from "../../../kyc-widget/IdentityFlow";
import { useWallet } from "@solana/wallet-adapter-react";

export const KYCClientSolana = (props: { setDID: (did: string) => void }) => {
  const { publicKey, signMessage } = useWallet();
  const address = publicKey?.toBase58();

  return (
    <>
      <div className="pt-10 text-center">
        <p className="text-2xl font-bold">
          NexeraID Kyc Demo: Solana Wallet KYC
        </p>
      </div>
      <div className="min-w-prose mt-24 flex flex-col items-center justify-center pt-2">
        {signMessage && address && (
          <IdentityFlow
            setDID={props.setDID}
            signMessageAsync={async (message: string) => {
              const messageBytes = new TextEncoder().encode(message);
              const signature = await signMessage(messageBytes);
              return signature && Buffer.from(signature).toString("hex");
            }}
            address={address}
            blockchainNamespace={"tezos"}
          />
        )}
      </div>
    </>
  );
};
