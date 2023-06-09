import { NextApiRequest, NextApiResponse } from "next";
import { deleteFile, readFile } from "../../../src/utils/files_server";

const dataWebHookGet = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { address } = req.query;
    const fileName = `data_webhook_${address}`;
    let response;

    try {
      response = readFile(fileName);
      deleteFile(fileName);
    } catch (e) {
      response = undefined;
    }

    res.status(200).json(response ? JSON.parse(response.toString()) : response);
  }
};

export default dataWebHookGet;
