import { NextApiRequest, NextApiResponse } from "next";
import { appConfig } from "../../appConfig";
import { env } from "../../env.mjs";

/*
 * Get access token
 * This has to be done from secured server, to avoid leaking API_KEY
 */
const getAccessToken = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query;
  const { address } = query;
  const apiHost = appConfig[env.NEXT_PUBLIC_ENVIRONMENT].api;
  try {
    const response = await fetch(`${apiHost}kyc/auth/access-token`, {
      body: JSON.stringify({ address: address }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.NEXERA_ID_API_KEY}`,
      },
      method: "POST",
    });
    const { accessToken, ...error } = await response.json();
    console.log("ACEESS TOKEN ", accessToken, error);
    res.status(200).json({ accessToken });
  } catch (e) {
    console.log("ERROR: ", e);
    console.error(e);
    res.status(400).json({ message: "BAD REQUEST" });
  }
};

export default getAccessToken;
