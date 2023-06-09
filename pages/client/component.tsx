"use client";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import KYCFlow from "../../components/KYCFlow";
import WebHooks from "../../components/WebHooks";
import { Inter } from "next/font/google";
import styles from "./client.module.css";

const inter = Inter({ subsets: ["latin"] });

const Client = () => {
  const { address, connector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  const renderComponent = () => {
    if (isConnected)
      return (
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
      );
    return (
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
    );
  };

  return (
    <main className={`${inter.className} ${styles.main}`}>
      {renderComponent()}
    </main>
  );
};

export default Client;
