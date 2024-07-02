import { IdentityFlow } from "../../../kyc-widget/IdentityFlow";
import ConnectCardano from "../cardano/ConnectCardano";
import {
  signWithCardano,
  useCardanoWallet,
} from "../../utils/useCardanoWallet";

export const KYCClientCardano = (props: { setDID: (did: string) => void }) => {
  const { wallet, address } = useCardanoWallet();
  return (
    <>
      <div className="pt-10 text-center">
        <p className="text-2xl font-bold">
          NexeraID Kyc Demo: Cardano Wallet KYC
        </p>
      </div>
      <div className="min-w-prose mt-24 flex flex-col items-center justify-center pt-2">
        <ConnectCardano />
        {wallet && (
          <IdentityFlow
            setDID={props.setDID}
            signMessageAsync={async (message: string) => {
              return await signWithCardano(message, wallet);
            }}
            address={address}
            blockchainNamespace={"cardano"}
          />
        )}
      </div>
    </>
  );
};
