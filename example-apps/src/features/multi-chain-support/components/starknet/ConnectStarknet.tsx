import { Button } from "@/features/bank/Components/Button";
import { useStarknetWallet } from "../../utils/useStarknetWallet";

const ConnectStarknet = () => {
  const { wallet, connectStarknet } = useStarknetWallet();
  return (
    <div>
      {wallet === undefined ? (
        <Button
          onClick={() => {
            void connectStarknet();
          }}
          className="m-2"
        >
          Connect to Starknet Wallet
        </Button>
      ) : (
        <div>connected to starknet wallet</div>
      )}
    </div>
  );
};

export default ConnectStarknet;
