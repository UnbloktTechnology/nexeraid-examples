import { NextApiRequest, NextApiResponse } from "next";
import {redis} from "../../../features/redis";

const ruleWebHookGet = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { address } = req.query;
    const addressLowerCase = (address as string).toLowerCase();
    const key = `rule_webhook_${addressLowerCase}`;
    let response;

    try {
      console.log("key", key);
      response = await redis.get(key);
      redis.set(key, "");
    } catch (e) {
      console.error("rule webhook get error", e);
      response = undefined;
    }

    console.log("rule webhook get response", response);
    res.status(200).json(response || {});
  }
};

export default ruleWebHookGet;
