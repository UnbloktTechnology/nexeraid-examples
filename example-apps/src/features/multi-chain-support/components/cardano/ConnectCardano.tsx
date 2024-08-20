import { Button } from "@/features/bank/Components/Button";
import { useCardanoWallet } from "../../utils/useCardanoWallet";

const ConnectCardano = () => {
  const { wallet, connectCardano } = useCardanoWallet();
  return (
    <div>
      {wallet === undefined ? (
        <Button
          onClick={() => {
            void connectCardano();
          }}
          className="m-2"
        >
          Connect to Cardano Wallet
        </Button>
      ) : (
        <div>connected to cardano wallet</div>
      )}
    </div>
  );
};

export default ConnectCardano;
