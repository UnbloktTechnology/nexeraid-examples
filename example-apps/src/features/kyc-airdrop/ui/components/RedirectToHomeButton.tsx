import { useWalletCheck } from "@/features/kyc-airdrop/hooks/useWalletCheck";
import { Button } from "./Button";
import { useState } from "react";

interface RedirectToHomeButtonProps {
  label?: string;
  variant?: "primary" | "secondary";
}

export const RedirectToHomeButton = ({
  label,
  variant,
}: RedirectToHomeButtonProps) => {
  const { disconnectWallet, redirectToHome } = useWalletCheck();
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleRedirectToHome = async () => {
    setIsDisconnecting(true);
    await disconnectWallet();
    setIsDisconnecting(false);
    redirectToHome();
  };

  return (
    <Button
      variant={variant ?? "secondary"}
      onClick={() => void handleRedirectToHome()}
      isLoading={isDisconnecting}
      disabled={isDisconnecting}
    >
      {label ?? "Try another wallet"}
    </Button>
  );
};
