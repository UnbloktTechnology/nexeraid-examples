import { NextApiRequest, NextApiResponse } from "next";

/*
 * Handle data from webhook
 * At the defined wehbook endpoint, each time an user shares data with you, data with format
 * {
 *   address: '0x0000000000000000000000000000000000000000',
 *   data: {
 *     ...
 *   }
 *  }
 */
const rulesValidation = async (req: NextApiRequest, res: NextApiResponse) => {
  const API_KEY = process.env.NEXT_PUBLIC_NEXERA_ID_API_KEY;

  const response = await fetch(
    "https://api.nexera.id/compliance/rules/execute",
    {
      body: JSON.stringify({
        inputData: {}, // data
        address: "0x82732eCa78474A772799b341100098F05464c401",
        policyId: `${POLICY_ID}`,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      method: "POST",
    }
  );

  const validationResult = await response.json();

  res.status(200).json(validationResult);
};

export default rulesValidation;
