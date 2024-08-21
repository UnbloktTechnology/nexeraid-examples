import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "@/env.mjs";
import { createApiClient } from "@nexeraid/js-sdk";

import "@/features/root/configureNodeDemoEnv";

const apiClient = createApiClient({
	apiKey: env.NEXERA_ID_API_KEY_DEFI_RULE_ENGINE,
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
		const params = req.body;

		const challengeRes = await apiClient.createWeb3Challenge({
			workflowId: env.NEXERA_ID_WORKFLOW_ID_DEFI_RULE_ENGINE,
			...params,
		});

		res.status(200).json(challengeRes);
	} catch (error) {
		console.error("API call error:", error);
		res.status(500).json({ error: "Failed to fetch access token" });
	}
}
