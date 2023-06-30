import { NextApiRequest, NextApiResponse } from "next";
import { redis } from "../scenario_webhook";
import { env } from "../../../env.mjs";

export const getDataWebhookRedisKey = (address: string) => {
  return (
    `${env.NEXT_PUBLIC_ENVIRONMENT}_KYC_EXAMPLE_DATA_WEBHOOK_` +
    address.toLowerCase()
  );
};

const dataWebHookPost = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const body = req.body;
    const addressLowerCase = (body.address as string).toLowerCase();
    const key = getDataWebhookRedisKey(addressLowerCase);
    console.log("dataWebHookPost - key", key);
    const result = await redis.set(key, JSON.stringify(body));
    res.status(200).json({ response: "ok" });
  }
};

export default dataWebHookPost;
