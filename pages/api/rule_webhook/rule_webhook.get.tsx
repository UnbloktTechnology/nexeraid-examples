import { NextApiRequest, NextApiResponse } from "next";
import { redis } from "../../../src/utils/redis";

const ruleWebHookGet = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { address } = req.query;
    const key = `rule_webhook_${address}`;
    let response;

    try {
      response = await redis.get(key);
    } catch (e) {
      console.error("rule webhook get error", e);
      response = undefined;
    }

    console.log("rule webhook response", response);
    res.status(200).json(JSON.parse(response?.toString() || "{}"));
  }
};

export default ruleWebHookGet;
