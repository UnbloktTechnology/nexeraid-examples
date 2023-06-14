"use client";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Inter } from "next/font/google";
import styles from "./client.module.css";
import { KYCFlow } from "./KYCFlow";
import { WebHooks } from "../webhooks/WebHooks";

const inter = Inter({ subsets: ["latin"] });

const Client = () => {
  const { address, connector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  return (
    <main className={`${inter.className} ${styles.main}`}>
      {isConnected && (
        <>
          <div>Connected to {connector?.name}: </div>
          <div>{address}</div>
          <button
            onClick={() => {
              disconnect();
            }}
          >
            Disconnect
          </button>
          <KYCFlow />
          <WebHooks />
        </>
      )}
      {!isConnected && (
        <div>
          {!isLoading &&
            connectors?.map((connector) => (
              <button key={connector.id} onClick={() => connect({ connector })}>
                {connector.name}
                {!connector.ready && " (unsupported)"}
                {isLoading &&
                  connector.id === pendingConnector?.id &&
                  " (connecting)"}
              </button>
            ))}
          {error && <div>{error.message}</div>}
        </div>
      )}
    </main>
  );
};

export default Client;
