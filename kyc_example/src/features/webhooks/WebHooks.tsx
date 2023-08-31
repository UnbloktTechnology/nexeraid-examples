import { useAccount } from "wagmi";
import { useMutation } from "@tanstack/react-query";
import styles from "./styles.module.css";
import { getDataWebHook, getScenarioWebhook } from "../apiClient";
import { useEffect } from "react";
import { IDENTITY_CLIENT } from "../../appConfig";

const formatResponse = (res?: unknown) => {
  if (!res) return "";
  return JSON.stringify(res, null, 1);
};

export const WebHooks = () => {
  const { address } = useAccount();
  const dataWebhook = useMutation(getDataWebHook);
  const scenarioWebhook = useMutation(getScenarioWebhook);

  useEffect(() => {
    // Get Off Chain Completition process event response
    if (address) {
      IDENTITY_CLIENT.onKycCompletion(async (data) => {
        console.log("KYC COMPLETION", data);
        dataWebhook.mutate(address);
        scenarioWebhook.mutate(address);
      });
    }
  }, [address, dataWebhook, scenarioWebhook]);

  return (
    <div className={styles.responseColumns}>
      <div>
        <h4>DATA: </h4>
        {dataWebhook.isLoading && <p>loading...</p>}
        <pre>{formatResponse(dataWebhook.data)}</pre>
      </div>
      <div>
        <h4>RULE:</h4>
        {scenarioWebhook.isLoading && <p>loading...</p>}
        <pre>{formatResponse(scenarioWebhook.data)}</pre>
      </div>
    </div>
  );
};
