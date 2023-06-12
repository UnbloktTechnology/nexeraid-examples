import { NextApiRequest, NextApiResponse } from "next";
import { redis } from "../../../src/utils/redis";

const dataWebHookPost = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const body = req.body;
    const key = `data_webhook_${body.address}`;
    console.log("key", key);
    const result = await redis.set(key, JSON.stringify(body));
    console.log("result", result);
    res.status(200).json({ response: "ok" });
  }
};

export default dataWebHookPost;
