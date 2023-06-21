import type { NextApiRequest, NextApiResponse } from "next";

import ruleWebHookGet from "./rule_webhook.get";
import ruleWebHookPost from "./rule_webhook.post";
import { Redis } from "@upstash/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET": {
      await ruleWebHookGet(req, res);
      break;
    }
    case "POST": {
      await ruleWebHookPost(req, res);
      break;
    }
    default: {
      res.status(405).end("Method Not Allowed");
      break;
    }
  }
}

export const redis = Redis.fromEnv();
