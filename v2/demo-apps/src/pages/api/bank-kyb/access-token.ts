import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "@/env.mjs";
import { createNexeraSdk } from "@nexeraid/js-sdk";

import "@/features/root/configureNodeDemoEnv";

const apiClient = createNexeraSdk({
  webhookSecret: env.NEXERA_ID_WEBHOOK_SECRET_BANK_KYB,
  apiKey: env.NEXERA_ID_API_KEY_BANK_KYB,
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
    // Get the current user ID
    // NOTE: This is a simplified example. In a real-world application, you should use a more secure method to get the user ID.
    const userId = req.body.userId;

    const authSession = await apiClient.createSession({
      externalCustomerId: userId,
      workflowId: env.NEXERA_ID_WORKFLOW_ID_BANK_KYB,
    });

    res.status(200).json(authSession);
  } catch (error) {
    console.error("API call error:", error);
    res.status(500).json({ error: "Failed to fetch access token" });
  }
}
