import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "@/env.mjs";

import { BlockchainAddress } from "@nexeraid/identity-schemas";
import { createApiClient } from "@nexeraid/js-sdk";

import "@/configureDemoEnv";

const apiClient = createApiClient({
  apiKey: env.NEXERA_ID_API_KEY_KYC_AIRDROP,
});

export default async function handler(props: { req: NextApiRequest, res: NextApiResponse }) {
  if (props.req.method === "GET") {
    try {
      // Validate input
      const address = BlockchainAddress.parse(props.req.query.id);
      const workspaceId = env.NEXERA_ID_WORKSPACE_ID;

      const response = await apiClient.getUserStatusByWallet({
        walletAddress: address,
        workspaceId: workspaceId,
      });

      props.res.status(200).json({ status: response });
    } catch (error) {
      console.error("API call error:", error);
      props.res.status(500).json({ error: "Failed to fetch customer status" });
    }
  } else {
    props.res.setHeader("Allow", ["GET"]);
    props.res.status(405).end(`Method ${props.req.method} Not Allowed`);
  }
}