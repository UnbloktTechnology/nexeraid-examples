import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { Button } from "./Button";
import { useEffect, useState } from "react";
import { useWalletCheck } from "@/features/kyc-airdrop/hooks/useWalletCheck";
import { useAccount } from "wagmi";

interface ConnectButtonProps {
  label: string;
  variant: "primary" | "secondary";
  forceDisconnect?: boolean;
}

export const ConnectButtonCustom = ({
  label,
  variant,
  forceDisconnect,
}: ConnectButtonProps) => {
  const { handleCheck, isBalancePending } = useWalletCheck();
  const { address, isConnected, connector } = useAccount();
  const [loading, setLoading] = useState(false);

  if (forceDisconnect && connector) {
    void connector.disconnect();
  }

  useEffect(() => {
    if (isConnected && address) {
      setLoading(true);
      handleCheck(address, () => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [isConnected, address, handleCheck]);

  useEffect(() => {
    if (isConnected && address) {
      setLoading(isBalancePending);
    }
  }, [isConnected, address, isBalancePending]);

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

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
                  <Button
                    onClick={openConnectModal}
                    variant={variant}
                    isLoading={loading}
                  >
                    {label}
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    variant={variant}
                    isLoading={loading}
                  >
                    Wrong network
                  </Button>
                );
              }
              return (
                <div className="flex gap-3">
                  <Button
                    onClick={openChainModal}
                    variant={variant}
                    isLoading={loading}
                  >
                    {chain.hasIcon && (
                      <div
                        className="mr-1 h-3 w-3 overflow-hidden rounded-full bg-cover"
                        style={{ background: chain.iconBackground }}
                      >
                        {chain.iconUrl && (
                          <Image
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            height={12}
                            width={12}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </Button>
                  <Button
                    onClick={openAccountModal}
                    variant={variant}
                    isLoading={loading}
                  >
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
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
