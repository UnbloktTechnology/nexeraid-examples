import { NextApiRequest, NextApiResponse } from "next";
import { redis } from "../../../src/utils/redis";

const dataWebHookGet = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { address } = req.query;
    const addressLowerCase = (address as string).toLowerCase();
    const key = `data_webhook_${addressLowerCase}`;

    try {
      const response = await redis.get(key);
      redis.set(key, "");
      res.status(200).json(response || {});
    } catch (e: any) {
      console.error("ERROR: ", e);
      res.status(500).json(e.stack);
    }
  }
};

export default dataWebHookGet;
