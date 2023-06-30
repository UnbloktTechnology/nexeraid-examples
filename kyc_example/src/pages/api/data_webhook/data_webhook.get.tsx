import { NextApiRequest, NextApiResponse } from "next";
import { redis } from "../scenario_webhook";
import { getDataWebhookRedisKey } from "./data_webhook.post";

const dataWebHookGet = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const key = getDataWebhookRedisKey(req.query.address as string);
    console.log("dataWebHookGet key", key);
    const response = await redis.get(key);
    console.log("data webhook get response", response);
    res.status(200).json(response || {});
  }
};

export default dataWebHookGet;
