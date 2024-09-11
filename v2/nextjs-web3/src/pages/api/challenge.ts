import type { NextApiRequest, NextApiResponse } from "next";
import { createApiClient, _setInternalConfig as _setInternalConfigNode } from "@nexeraid/js-sdk";

console.log("_setInternalConfigNode", { env: 'dev' });
_setInternalConfigNode({ env: 'dev' });

const apiClient = createApiClient({
    apiKey: process.env.NEXERA_ID_API_KEY_NEXTJS_WEB3!,
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
        const sessionRes = await apiClient.createWeb3Challenge({
            workflowId: process.env.NEXERA_ID_WORKFLOW_ID_NEXTJS_WEB3,
            ...req.body,
        });
        res.status(200).json(sessionRes);

    } catch (error) {
        console.error("API call error:", error);
        res.status(500).json({ error: "Failed to fetch access token" });
    }
}