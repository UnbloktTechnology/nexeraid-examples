import { NextApiRequest, NextApiResponse } from "next";

/*
 * Get access token
 * This has to be done from secured server, to avoid leaking API_KEY
 */
const getAccessToken = async (req: NextApiRequest, res: NextApiResponse) => {
  const API_KEY = process.env.NEXT_PUBLIC_NEXERA_ID_API_KEY;
  const query = req.query;
  const { address } = query;

  console.log("TOKEN: ", API_KEY);
  console.log("ADDRESS: ", address);

  try {
    const response = await fetch(
      "https://api.nexera.id/kyc/auth/access-token",
      {
        body: JSON.stringify({ address }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        method: "POST",
      }
    );
    const { accessToken, ...res } = await response.json();
    console.log("ACEESS TOKEN ", accessToken, res);
  } catch (e) {
    console.log("ERROR: ", e);
    console.error(e);
  }

  res.status(200).json({ accessToken: "asdasd" });
};

export default getAccessToken;
