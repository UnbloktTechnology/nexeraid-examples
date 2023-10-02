import { type NextApiRequest, type NextApiResponse } from "next";
import { env } from "@/env.mjs";
import { redis } from "@/server/redis";

export const getDataWebhookRedisKey = (address: string) => {
  return (
    `${env.NEXT_PUBLIC_ENVIRONMENT}_DEFI_EXAMPLE_DATA_WEBHOOK_` +
    address.toLowerCase()
  );
};

const dataWebHookPost = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("DATA WEBHOOK")
  if (req.method === "POST") {
    console.log("dataWebHookPost - req.body", req.body);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = req.body;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const key = getDataWebhookRedisKey(body.address as string);
    await redis.set(key, JSON.stringify(body));
    console.log(`Saved ${key} to redis`);
    res.status(200).json({ response: "ok" });
  }
  if (req.method === "GET") {
    res.status(200).json({ response: "ok" });
  }
};

export default dataWebHookPost;
