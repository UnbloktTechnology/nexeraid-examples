import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "@/env.mjs";
import { createNexeraSdk, WalletChallengeRequest } from "@nexeraid/js-sdk";

import "@/configureDemoEnv";

const apiClient = createNexeraSdk({
  webhookSecret: env.NEXERA_ID_WEBHOOK_SECRET_KYC_AIRDROP,
  apiKey: env.NEXERA_ID_API_KEY_KYC_AIRDROP,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    // Get the challenge parameters from the request body
    const params = WalletChallengeRequest.omit({ workflowId: true }).parse(
      req.body,
    );

    const challengeRes = await apiClient.createWeb3Challenge({
      ...params,
      workflowId: env.NEXERA_ID_WORKFLOW_ID_KYC_AIRDROP,
    });

    res.status(200).json(challengeRes);
  } catch (error) {
    console.error("API call error:", error);
    res.status(500).json({ error: "Failed to fetch access token" });
  }
}
