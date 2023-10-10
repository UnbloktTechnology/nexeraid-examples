import { type NextApiRequest, type NextApiResponse } from "next";
import { redis } from "./index";
import { env } from "@/env.mjs";

export const getScenarioWebhookKYCRedisKey = (address: string) => {
  return (
    `${env.NEXT_PUBLIC_ENVIRONMENT}_KYC_EXAMPLE_SCENARIO_WEBHOOK_` +
    address.toLowerCase()
  );
};

const scenarioWebHookPost = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method === "POST") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = req.body;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const key = getScenarioWebhookKYCRedisKey(body.address as string);
    console.log("scenarioWebHookPost key", key);
    const response = await redis.set(key, JSON.stringify(body));
    console.log("scenarioWebHookPost rule webhook post response", response);
    res.status(200).json({ response: "ok" });
  }
};

export default scenarioWebHookPost;
