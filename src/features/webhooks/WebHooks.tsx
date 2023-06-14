import { useAccount } from "wagmi";
import styles from "./styles.module.css";
import { getDataWebHook, getRuleWebHook } from "../apiClient";
import { useQuery } from "@tanstack/react-query";

export const WebHooks = () => {
  const { address } = useAccount();

  const dataWebhook = useQuery({
    queryKey: ["webhook", address],
    queryFn: async () => {
      if (!address) throw new Error("No address");
      const res = await getDataWebHook(address);
      if (Object.keys(res).length) {
        return JSON.stringify(res, null, 1);
      }
      return "";
    },
    refetchInterval: 5000,
    enabled: !!address,
  });

  const ruleWebHook = useQuery({
    queryKey: ["rulewebhook", address],
    queryFn: async () => {
      if (!address) throw new Error("No address");
      const res = await getRuleWebHook(address);
      if (Object.keys(res).length) {
        return JSON.stringify(res, null, 1);
      }
      return "";
    },
    refetchInterval: 5000,
    enabled: !!address,
  });

  return (
    <div className={styles.responseColumns}>
      <div>
        <h4>DATA: </h4>
        <pre>{dataWebhook.data}</pre>
      </div>
      <div>
        <h4>RULE:</h4>
        <pre>{ruleWebHook.data}</pre>
      </div>
    </div>
  );
};
