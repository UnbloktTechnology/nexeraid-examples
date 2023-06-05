import { NextApiRequest, NextApiResponse } from "next";

/*
 * Get access token
 * This has to be done from secured server, to avoid leaking API_KEY
 */
const getAccessToken = async (req: NextApiRequest, res: NextApiResponse) => {
  const API_KEY = process.env.NEXT_PUBLIC_NEXERA_ID_API_KEY;
  const query = req.query;
  const { address } = query;

  try {
    const response = await fetch(
      // "https://api-dev.nexera.id/kyc/auth/access-token"
      "http://localhost:3001/kyc/auth/access-token",
      {
        body: JSON.stringify({ publicAddress: address }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        method: "POST",
      }
    );
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
