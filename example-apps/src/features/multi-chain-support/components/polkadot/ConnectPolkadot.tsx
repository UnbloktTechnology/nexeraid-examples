import { Button } from "@/features/bank/Components/Button";
import { usePolkadotWallet } from "../../utils/usePolkadotWallet";

const ConnectPolkadot = () => {
  const { wallet, connectPolkadot } = usePolkadotWallet();
  return (
    <div>
      {wallet === undefined ? (
        <Button
          onClick={() => {
            void connectPolkadot();
          }}
          className="m-2"
        >
          Connect to Polkadot Wallet
        </Button>
      ) : (
        <div>Connected to Polkadot Wallet</div>
      )}
    </div>
  );
};

export default ConnectPolkadot;
