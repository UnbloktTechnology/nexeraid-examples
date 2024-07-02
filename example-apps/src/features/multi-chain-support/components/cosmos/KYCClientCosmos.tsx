import { IdentityFlow } from "../../../kyc-widget/IdentityFlow";
import ConnectCosmos from "./ConnectCosmos";
import { signWithCosmos, useCosmosWallet } from "../../utils/useCosmosWallet";

export const KYCClientCosmos = (props: { setDID: (did: string) => void }) => {
  const { wallet, address } = useCosmosWallet();
  return (
    <>
      <div className="pt-10 text-center">
        <p className="text-2xl font-bold">
          NexeraID Kyc Demo: Cosmos Wallet KYC
        </p>
      </div>
      <div className="min-w-prose mt-24 flex flex-col items-center justify-center pt-2">
        <ConnectCosmos />
        {wallet && (
          <IdentityFlow
            setDID={props.setDID}
            signMessageAsync={async (message: string) => {
              return await signWithCosmos(message, wallet);
            }}
            address={address}
            blockchainNamespace={"cosmos"}
          />
        )}
      </div>
    </>
  );
};
