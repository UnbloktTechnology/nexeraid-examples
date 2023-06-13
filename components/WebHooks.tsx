import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { getDataWebHook, getRuleWebHook } from "../src/utils/api_client";
import { useQuery } from "react-query";
import styles from "./styles.module.css";

const WebHooks = () => {
  const [data, setData] = useState("");
  const [rule, setRule] = useState("");
  const { address } = useAccount();

  const { data: dataWebHook } = useQuery(
    ["dataWebHook", address, data],
    () => getDataWebHook(address as string),
    {
      // The query will not execute until the address exists
      enabled: !!address && !data,
    }
  );

  const { data: ruleWebHook } = useQuery(
    ["ruleWebHook", address, rule],
    () => getRuleWebHook(address as string),
    {
      // The query will not execute until the address exists
      enabled: !!address && !rule,
    }
  );

  useEffect(() => {
    if (dataWebHook && Object.keys(dataWebHook).length)
      setData(JSON.stringify(dataWebHook, null, 1));
  }, [dataWebHook]);

  useEffect(() => {
    if (ruleWebHook && Object.keys(ruleWebHook).length)
      setData(JSON.stringify(ruleWebHook, null, 1));
  }, [ruleWebHook]);

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

export default WebHooks;
