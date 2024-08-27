import type { NextApiRequest, NextApiResponse } from "next";
import { appConfig } from "@/appConfig";
import { env } from "@/env.mjs";
import { z } from "zod";

import { BlockchainAddress } from "@nexeraid/identity-schemas";

const inputSchema = z.object({
  address: BlockchainAddress,
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
      const workspaceId = env.NEXERA_ID_WORKSPACE_ID;

      const response = await fetch(
        `${apiHost}/projects/${workspaceId}/customer-wallets/${input.address}/customer`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.NEXERA_ID_API_KEY_KYC_AIRDROP}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as { status: string };
      console.log("response", data.status);

      res.status(200).json({ status: data.status });
    } catch (error) {
      console.error("API call error:", error);
      res.status(500).json({ error: "Failed to fetch customer status" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
