import { useAccount } from "wagmi";
import { useMutation } from "@tanstack/react-query";
import styles from "./styles.module.css";
import { getScenarioWebhook } from "../apiClient";
import { useEffect } from "react";
import { IDENTITY_CLIENT } from "../identity/IdentityClient";

const formatResponse = (res?: unknown) => {
  if (!res) return "";
  return JSON.stringify(res, null, 1);
};

export const WebHooks = () => {
  const { address } = useAccount();
  const scenarioWebhook = useMutation(getScenarioWebhook);

  useEffect(() => {
    // Get Off Chain Completition process event response
    if (address) {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      IDENTITY_CLIENT.onKycCompletion((data) => {
        console.log("KYC COMPLETION", data);
        scenarioWebhook.mutate(address);
      });
    }
  }, [address, scenarioWebhook]);

  return (
    <div className={styles.responseColumns}>
      <div>
        <h4>RULE:</h4>
        {scenarioWebhook.isLoading && <p>loading...</p>}
        <pre>{formatResponse(scenarioWebhook.data)}</pre>
      </div>
    </div>
  );
};
