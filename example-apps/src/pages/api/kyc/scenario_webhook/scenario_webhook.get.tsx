import { type NextApiRequest, type NextApiResponse } from "next";
import { redis } from "./index";
import { getScenarioWebhookKYCRedisKey } from "./scenario_webhook.post";

const scenarioWebHookGet = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method === "GET") {
    const key = getScenarioWebhookKYCRedisKey(req.query.address as string);
    console.log("scenarioWebHookGet key", key);
    const response = await redis.get(key);
    console.log("scenario webhook get response", response);

    // clear redis
    await redis.del(key);
    res.status(200).json(response || {});
  }
};

export default scenarioWebHookGet;
