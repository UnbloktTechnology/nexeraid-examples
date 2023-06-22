import { NextApiRequest, NextApiResponse } from "next";
import { redis } from "../scenario_webhook";

const dataWebHookPost = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const body = req.body;
    const addressLowerCase = (body.address as string).toLowerCase();
    const key = `data_webhook_${addressLowerCase}`;
    console.log("dataWebHookPost - key", key);
    const result = await redis.set(key, JSON.stringify(body));
    console.log("data webhook post response", result);
    res.status(200).json({ response: "ok" });
  }
};

export default dataWebHookPost;
