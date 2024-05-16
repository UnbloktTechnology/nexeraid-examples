import { IdentityFlow } from "@/features/identity-widget/IdentityFlow";
import ConnectPolkadot from "./ConnectPolkadot";
import {
  signWithPolkadot,
  usePolkadotWallet,
} from "../../utils/usePolkadotWallet";

export const KYCClientPolkadot = (props: { setDID: (did: string) => void }) => {
  const { wallet } = usePolkadotWallet();
  return (
    <>
      <div className="pt-10 text-center">
        <p className="text-2xl font-bold">
          NexeraID Kyc Demo: Polkadot Wallet KYC
        </p>
      </div>
      <div className="min-w-prose mt-24 flex flex-col items-center justify-center pt-2">
        <ConnectPolkadot />
        {wallet && (
          <IdentityFlow
            setDID={props.setDID}
            signMessageAsync={async (message: string) => {
              return await signWithPolkadot(
                message,
                wallet.address,
                wallet.injector,
              );
            }}
            address={wallet.address}
            blockchainNamespace={"polkadot"}
          />
        )}
      </div>
    </>
  );
};
