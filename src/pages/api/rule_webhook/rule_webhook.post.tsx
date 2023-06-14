import { NextApiRequest, NextApiResponse } from "next";
import { redis } from "../../../utils/redis";

const ruleWebHookPost = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const body = req.body;
    const key = `rule_webhook_${body.address}`;
    console.log("key", key);
    const response = await redis.set(key, JSON.stringify(body));

    console.log("rule webhook post response", response);
    res.status(200).json({ response: "ok" });
  }
};

export default ruleWebHookPost;
