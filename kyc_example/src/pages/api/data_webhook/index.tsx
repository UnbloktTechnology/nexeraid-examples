import type { NextApiRequest, NextApiResponse } from "next";

import dataWebHookGet from "./data_webhook.get";
import dataWebHookPost from "./data_webhook.post";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET": {
      await dataWebHookGet(req, res);
      break;
    }
    case "POST": {
      console.log("🪝data_webhook/index.tsx - POST");
      await dataWebHookPost(req, res);
      break;
    }
    default: {
      res.status(405).end("Method Not Allowed");
      break;
    }
  }
}
