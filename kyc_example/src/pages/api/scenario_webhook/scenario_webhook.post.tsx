import { NextApiRequest, NextApiResponse } from "next";
import { redis } from "./index";
import { env } from "../../../env.mjs";

export const getScenarioWebhookRedisKey = (address: string) => {
  return (
    `${env.NEXT_PUBLIC_ENVIRONMENT}_KYC_EXAMPLE_SCENARIO_WEBHOOK_` +
    address.toLowerCase()
  );
};

const scenarioWebHookPost = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "POST") {
    const body = req.body;
    const key = getScenarioWebhookRedisKey(body.address as string);
    console.log("scenarioWebHookPost key", key);
    const response = await redis.set(key, JSON.stringify(body));
    console.log("scenarioWebHookPost rule webhook post response", response);
    res.status(200).json({ response: "ok" });
  }
};

export default scenarioWebHookPost;
