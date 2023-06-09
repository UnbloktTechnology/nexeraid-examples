import { NextApiRequest, NextApiResponse } from "next";
import { writeFile } from "../../../src/utils/files_server";

const ruleWebHookPost = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const body = req.body;
    writeFile(`rule_webhook_${body.address}`, JSON.stringify(body));

    res.status(200).json({ response: "ok" });
  }
};

export default ruleWebHookPost;
