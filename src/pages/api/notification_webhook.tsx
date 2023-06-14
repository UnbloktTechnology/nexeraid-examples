import { NextApiRequest, NextApiResponse } from "next";

const notificationWebHook = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  console.log("NOTIFICATION: ", req.body);
};

export default notificationWebHook;
