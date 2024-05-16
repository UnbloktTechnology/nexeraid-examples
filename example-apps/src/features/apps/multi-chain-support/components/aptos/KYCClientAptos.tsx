import { IdentityFlow } from "@/features/identity-widget/IdentityFlow";
import ConnectAptos from "./ConnectAptos";
import { signWithAptos, useAptosWallet } from "../../utils/useAptosWallet";

export const KYCClientAptos = (props: { setDID: (did: string) => void }) => {
  const { wallet, address } = useAptosWallet();
  return (
    <>
      <div className="pt-10 text-center">
        <p className="text-2xl font-bold">
          NexeraID Kyc Demo: Aptos Wallet KYC
        </p>
      </div>
      <div className="min-w-prose mt-24 flex flex-col items-center justify-center pt-2">
        <ConnectAptos />
        {wallet && (
          <IdentityFlow
            setDID={props.setDID}
            signMessageAsync={async (message: string) => {
              return await signWithAptos(message, wallet);
            }}
            address={address}
            blockchainNamespace={"aptos"}
          />
        )}
      </div>
    </>
  );
};
