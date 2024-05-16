import { Button } from "@/features/apps/bank/Components/Button";
import { useAptosWallet } from "../../utils/useAptosWallet";

const ConnectAptos = () => {
  const { wallet, connectAptos } = useAptosWallet();
  return (
    <div>
      {wallet === undefined ? (
        <Button
          onClick={() => {
            void connectAptos();
          }}
          className="m-2"
        >
          Connect to Aptos Wallet
        </Button>
      ) : (
        <div>connected to aptos wallet</div>
      )}
    </div>
  );
};

export default ConnectAptos;
