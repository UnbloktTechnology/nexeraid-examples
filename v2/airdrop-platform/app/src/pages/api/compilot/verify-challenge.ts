import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "@/env.mjs";
import { createSdk, VerifyWalletChallengeRequest } from "@compilot/js-sdk";

import "@/configureDemoEnv";
import { CustomerRepo } from "@/db/customer.repo";

const apiClient = createSdk({
  webhookSecret: env.COMPILOT_WEBHOOK_SECRET_KYC_AIRDROP,
  apiKey: env.COMPILOT_API_KEY_KYC_AIRDROP,
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
    const params = VerifyWalletChallengeRequest.parse(req.body);

    const authSession = await apiClient.verifyWeb3Challenge({
      address: params.address,
      blockchainId: params.blockchainId,
      message: params.message,
      signature: params.signature,
      namespace: params.namespace,
      signedMessage: params.signedMessage,
      signerPublicKey: params.signerPublicKey,
      signerPublicKeyType: params.signerPublicKeyType,
    });

    console.log("authSession", authSession);

    // now we know this user is correctly authenticated
    // we can save his infos in our database
    if (authSession.externalCustomerId) {
      const myUserId = parseInt(authSession.externalCustomerId, 10);
      await CustomerRepo.setLastLogin(myUserId);
    }

    res.status(200).json(authSession);
  } catch (error) {
    console.error("API call error:", error);
    res.status(500).json({ error: "Failed to fetch access token" });
  }
}
