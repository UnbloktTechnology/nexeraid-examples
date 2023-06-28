import { NextApiRequest, NextApiResponse } from "next";
import { redis } from "./index";

const scenarioWebHookGet = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "GET") {
    const { address } = req.query;
    const addressLowerCase = (address as string).toLowerCase();
    const key = `scenario_webhook_${addressLowerCase}`;
    let response;

    try {
      console.log("scenarioWebHookGet key", key);
      response = await redis.get(key);
    } catch (e) {
      console.error("scenario webhook get error", e);
      response = undefined;
    }

    console.log("scenario webhook get response", response);
    res.status(200).json(response || {});
  }
};

export default scenarioWebHookGet;
