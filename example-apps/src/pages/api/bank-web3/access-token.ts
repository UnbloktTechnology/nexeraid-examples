import type { NextApiRequest, NextApiResponse } from "next";
import { appConfig } from "@/appConfig";
import { env } from "@/env.mjs";
import { z } from "zod";

import {
  BlockchainAddress,
  BlockchainNamespace,
} from "@nexeraid/identity-schemas";

const inputSchema = z.object({
  address: BlockchainAddress,
  blockchainNamespace: BlockchainNamespace,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      // Validate input
      const input = inputSchema.parse(req.body);

      const apiHost = appConfig[env.NEXT_PUBLIC_ENVIRONMENT].api;
      console.log("apiHost", apiHost);

      const response = await fetch(`${apiHost}kyc/auth/access-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.NEXERA_ID_API_KEY_BANK_WEB3}`,
        },
        body: JSON.stringify({
          address: input.address,
          blockchainNamespace: input.blockchainNamespace,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as { accessToken: string };
      console.log("response", data.accessToken);

      res.status(200).json({ accessToken: data.accessToken });
    } catch (error) {
      console.error("API call error:", error);
      res.status(500).json({ error: "Failed to fetch access token" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
