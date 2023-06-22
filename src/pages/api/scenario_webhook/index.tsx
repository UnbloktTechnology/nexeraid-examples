import type { NextApiRequest, NextApiResponse } from "next";

import { Redis } from "@upstash/redis";
import ruleWebHookGet from "./scenario_webhook.get";
import ruleWebHookPost from "./scenario_webhook.post";

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
