import { NextApiRequest, NextApiResponse } from "next";
import { redis } from "./index";

const scenarioWebHookPost = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "POST") {
    const body = req.body;
    const addressLowerCase = (body.address as string).toLowerCase();
    const key = `scenario_webhook_${addressLowerCase}`;
    console.log("scenarioWebHookPost key", key);
    const response = await redis.set(key, JSON.stringify(body));

    console.log("scenarioWebHookPost rule webhook post response", response);
    res.status(200).json({ response: "ok" });
  }
};

export default scenarioWebHookPost;
