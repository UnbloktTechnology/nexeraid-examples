import { NextApiRequest, NextApiResponse } from "next";
import { redis } from "./index";
import { getScenarioWebhookRedisKey } from "./scenario_webhook.post";

const scenarioWebHookGet = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "GET") {
    const key = getScenarioWebhookRedisKey(req.query.address as string);
    console.log("scenarioWebHookGet key", key);
    const response = await redis.get(key);
    console.log("scenario webhook get response", response);
    res.status(200).json(response || {});
  }
};

export default scenarioWebHookGet;
