import { Button } from "./Button";
import { getAirdropTokenConfig } from "@/config/EXAMPLE_AIRDROP_CONTRACT_ADDRESSES";
import { useAddToken } from "@/lib/useAddToken";

interface AddTokenButtonProps {
  label?: string;
  variant?: "primary" | "secondary";
}

export const AddTokenButton = ({ label, variant }: AddTokenButtonProps) => {
  const addToken = useAddToken();
  const { symbol } = getAirdropTokenConfig();
  return (
    <Button variant={variant ?? "secondary"} onClick={addToken}>
      {label ?? `Add ${symbol} to your wallet`}
    </Button>
  );
};
