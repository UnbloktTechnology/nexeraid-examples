import { type NextApiRequest } from "next";

const notificationWebHook = (req: NextApiRequest) => {
  console.log("NOTIFICATION: ", req.body);
};

export default notificationWebHook;
