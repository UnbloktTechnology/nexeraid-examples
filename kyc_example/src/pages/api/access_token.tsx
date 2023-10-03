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

  const response = await fetch(`${apiHost}kyc/auth/access-token`, {
    body: JSON.stringify({ address: address }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.NEXERA_ID_API_KEY}`,
    },
    method: "POST",
  });

  const { accessToken } = await response.json();
  res.status(200).json({ accessToken });
};

export default getAccessToken;
