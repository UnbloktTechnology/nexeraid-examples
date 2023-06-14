import { NextApiRequest, NextApiResponse } from "next";
import { redis } from "../../../utils/redis";

const dataWebHookGet = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { address } = req.query;
    const addressLowerCase = (address as string).toLowerCase();
    const key = `data_webhook_${addressLowerCase}`;
    let response;

    try {
      console.log("key", key);
      response = await redis.get(key);
      redis.set(key, "");
    } catch (e) {
      console.error("data webhook get error", e);
      response = undefined;
    }

    console.log("data webhook get response", response);
    res.status(200).json(response || {});
  }
};

export default dataWebHookGet;
