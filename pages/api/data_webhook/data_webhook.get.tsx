import { NextApiRequest, NextApiResponse } from "next";
import { deleteFile, readFile } from "../../../src/utils/files_server";
import { redis } from "../../../src/utils/redis";

const dataWebHookGet = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { address } = req.query;
    const key = `data_webhook_${address}`;
    let response;
    try {
      response = await redis.get(key);
    } catch (e) {
      console.error(e)
      response = undefined;
    }

    res.status(200).json(JSON.parse(response?.toString() || "{}"));
  }
};

export default dataWebHookGet;
