import { IdentityFlow } from "../../../kyc-widget/IdentityFlow";
import ConnectTezos from "./ConnectTezos";
import { signWithTezos, useTezosWallet } from "../../utils/useTezosWallet";

export const KYCClientTezos = (props: { setDID: (did: string) => void }) => {
  const { wallet, address } = useTezosWallet();
  return (
    <>
      <div className="pt-10 text-center">
        <p className="text-2xl font-bold">
          NexeraID Kyc Demo: Tezos Wallet KYC
        </p>
      </div>
      <div className="min-w-prose mt-24 flex flex-col items-center justify-center pt-2">
        <ConnectTezos />
        {wallet && (
          <IdentityFlow
            setDID={props.setDID}
            signMessageAsync={async (message: string) => {
              return await signWithTezos(message, wallet);
            }}
            address={address}
            blockchainNamespace={"tezos"}
          />
        )}
      </div>
    </>
  );
};
