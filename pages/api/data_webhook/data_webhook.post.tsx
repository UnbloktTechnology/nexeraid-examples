import { NextApiRequest, NextApiResponse } from "next";
import { redis } from "../../../src/utils/redis";

const dataWebHookPost = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const body = req.body;
    const key = `data_webhook_${body.address.toLowerCase()}`;

    const response = await redis.set(key, JSON.stringify(body));

    res.status(200).json({ response: response });
  }
};

export default dataWebHookPost;
