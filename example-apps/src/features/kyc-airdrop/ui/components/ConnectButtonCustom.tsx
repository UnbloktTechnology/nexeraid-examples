import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { Button } from "./Button";
import { useEffect } from "react";
import { useWalletCheck } from "@/features/kyc-airdrop/hooks/useWalletCheck"; // Adjust the path as needed
import { useAccount } from "wagmi";

interface ConnectButtonProps {
  label: string;
  variant: "primary" | "secondary";
}

export const ConnectButtonCustom = ({ label, variant }: ConnectButtonProps) => {
  const { handleCheck } = useWalletCheck();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      handleCheck(address, () => {console.log("Address checked :" + address)});
    }
  }, [isConnected, address, handleCheck]);

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
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
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
                <div style={{ display: "flex", gap: 12 }}>
                  <Button onClick={openChainModal} variant={variant}>
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <Image
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </Button>
                  <Button onClick={openAccountModal} variant={variant}>
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
