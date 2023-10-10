import { type NextApiRequest, type NextApiResponse } from "next";
import { env } from "@/env.mjs";
import { redis } from "@/server/redis";

export const getScenarioWebhookDefiRuleEngineRedisKey = (address: string) => {
  return (
    `${env.NEXT_PUBLIC_ENVIRONMENT}_DEFI_RULE_ENGINE_EXAMPLE_SCENARIO_WEBHOOK_` +
    address.toLowerCase()
  );
};

const scenarioWebHookPost = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "POST") {
    console.log("scenarioWebHookPost req.body", req.body);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = req.body;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const key = getScenarioWebhookDefiRuleEngineRedisKey(body.address as string);
    await redis.set(key, JSON.stringify(body));
    res.status(200).json({ response: "ok" });
  }
  if (req.method === "GET") {
    res.status(200).json({ response: "ok" });
  }
};

export default scenarioWebHookPost;
