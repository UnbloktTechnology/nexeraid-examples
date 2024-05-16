import { IdentityFlow } from "@/features/identity-widget/IdentityFlow";
import ConnectPolkadot from "./ConnectPolkadot";
import {
  signWithPolkadot,
  usePolkadotWallet,
} from "../../utils/usePolkadotWallet";

const AGUNG_WS_URL = "wss://wsspc1-qa.agung.peaq.network";

export const KYCClientAgung = (props: { setDID: (did: string) => void }) => {
  const { wallet } = usePolkadotWallet(AGUNG_WS_URL);
  return (
    <>
      <div className="pt-10 text-center">
        <p className="text-2xl font-bold">
          NexeraID Kyc Demo: Agung Wallet KYC
        </p>
      </div>
      <div className="min-w-prose mt-24 flex flex-col items-center justify-center pt-2">
        <ConnectPolkadot wsUrl={AGUNG_WS_URL} />
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
