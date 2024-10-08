import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { Button } from "./Button";
import { useWalletCheck } from "@/features/kyc-airdrop/hooks/useWalletCheck";
import { type Address } from "@nexeraid/identity-schemas";

interface ConnectButtonProps {
  label: string;
  variant: "primary" | "secondary";
}

export const ConnectButtonCustom = ({ label, variant }: ConnectButtonProps) => {
  const { redirectToCheckWallet } = useWalletCheck();

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              className: "opacity-0 pointer-events-none select-none",
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={openConnectModal} variant={variant}>
                    {label}
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} variant={variant}>
                    Wrong network
                  </Button>
                );
              }
              return (
                <div className="flex gap-3">
                  <Button
                    onClick={openChainModal}
                    variant="primary"
                    className="flex flex-row items-center gap-2"
                  >
                    {chain.iconUrl && (
                      <Image
                        alt={chain.name ?? "Chain icon"}
                        src={chain.iconUrl}
                        height={12}
                        width={12}
                      />
                    )}
                    {chain.name}
                  </Button>
                  <Button onClick={openAccountModal} variant="primary">
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </Button>
                  <Button
                    onClick={() =>
                      redirectToCheckWallet(account.address as Address)
                    }
                    variant={variant}
                  >
                    Check the wallet
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
