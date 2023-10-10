import { NextApiRequest, NextApiResponse } from "next";

const notificationWebHook = async (req: NextApiRequest) => {
  console.log("NOTIFICATION: ", req.body);
};

export default notificationWebHook;
