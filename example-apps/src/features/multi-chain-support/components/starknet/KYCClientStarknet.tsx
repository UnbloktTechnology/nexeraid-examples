import { IdentityFlow } from "../../../kyc-widget/IdentityFlow";
import ConnectStarknet from "../starknet/ConnectStarknet";
import type { Account } from "starknet";

import {
  signWithStarknet,
  useStarknetWallet,
} from "../../utils/useStarknetWallet";

export const KYCClientStarknet = (props: { setDID: (did: string) => void }) => {
  const { wallet } = useStarknetWallet();
  return (
    <>
      <div className="pt-10 text-center">
        <p className="text-2xl font-bold">
          NexeraID Kyc Demo: Starknet Wallet KYC
        </p>
      </div>
      <div className="min-w-prose mt-24 flex flex-col items-center justify-center pt-2">
        <ConnectStarknet />
        {wallet && (
          <IdentityFlow
            setDID={props.setDID}
            signMessageAsync={async (message: string) => {
              return await signWithStarknet(message, wallet.account as Account);
            }}
            address={wallet.selectedAddress}
            blockchainNamespace={"tezos"}
          />
        )}
      </div>
    </>
  );
};
