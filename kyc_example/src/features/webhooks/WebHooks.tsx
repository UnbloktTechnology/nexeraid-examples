import { useAccount } from "wagmi";
import styles from "./styles.module.css";
import { getDataWebHook, getScenarioWebhook } from "../apiClient";
import { useEffect, useState } from "react";
import { KYC_CLIENT } from "../../appConfig";

const formatResponse = (res: any) => {
  if (Object.keys(res).length) {
    return JSON.stringify(res, null, 1);
  }
  return "";
};

export const WebHooks = () => {
  const { address } = useAccount();
  const [data, setData] = useState("");
  const [rule, setRule] = useState("");

  useEffect(() => {
    // Get Off Chain Completition process event response
    if (address) {
      KYC_CLIENT.onOffChainShareCompletition(async () => {
        const _data = await getDataWebHook(address as string);
        const _rule = await getScenarioWebhook(address as string);

        setData(formatResponse(_data));
        setRule(formatResponse(_rule));
      });
    }
  }, [address]);

  return (
    <div className={styles.responseColumns}>
      <div>
        <h4>DATA: </h4>
        <pre>{data}</pre>
      </div>
      <div>
        <h4>RULE:</h4>
        <pre>{rule}</pre>
      </div>
    </div>
  );
};
