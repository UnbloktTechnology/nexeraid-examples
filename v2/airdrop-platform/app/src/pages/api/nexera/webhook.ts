import { type NextApiRequest, type NextApiResponse } from "next";
import { env } from "@/env.mjs";
import { createNexeraSdk } from "@nexeraid/js-sdk";
import { CustomerRepo } from "@/db/customer.repo";
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
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const event = apiClient.validateWebhookEvent({
      // those are the only headers we are interested in
      headers: {
        "svix-id": req.headers["svix-id"] as string,
        "svix-signature": req.headers["svix-signature"] as string,
        "svix-timestamp": req.headers["svix-timestamp"] as string,
      },
      body: req.body as Record<string, unknown>,
    });

    if (
      event.eventType === "customer.created" ||
      event.eventType === "customer.updated"
    ) {
      // fetch additional data from the API
      const wallets = await apiClient.getCustomerWallets({
        customerId: event.payload.customerId,
      });

      // verify we have all the infos we need
      const wallet = wallets[0];
      if (!wallet) {
        return res.status(400).json({ message: "No wallet found" });
      }
      if (!event.payload.status) {
        return res.status(400).json({ message: "No status found" });
      }

      // upsert the customer in the project database for fast access
      await CustomerRepo.upsert({
        nexeraCustomerId: event.payload.customerId,
        userStatus: event.payload.status,
        walletAddress: wallet.address,
      });
    }

    // it's important to answer 200 when the webhook is processed successfully
    res.status(200).json({ message: "Customer status updated successfully" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(400).json({ message: "Invalid payload" });
  }
}
