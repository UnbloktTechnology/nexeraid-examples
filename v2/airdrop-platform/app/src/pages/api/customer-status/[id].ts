import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "@/env.mjs";

import { BlockchainAddress } from "@nexeraid/identity-schemas";
import { createApiClient } from "@nexeraid/js-sdk";

import "@/configureDemoEnv";

const apiClient = createApiClient({
  apiKey: env.NEXERA_ID_API_KEY_KYC_AIRDROP,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    // Validate input
    const address = BlockchainAddress.parse(req.query.id);
    const workspaceId = env.NEXERA_ID_WORKSPACE_ID;

    const response = await apiClient.getCustomerStatusByWallet({
      walletAddress: address,
      workspaceId: workspaceId,
    });

    res.status(200).json({ status: response });
  } catch (error) {
    console.error("API call error:", error);
    res.status(500).json({ error: "Failed to fetch customer status" });
  }
}
