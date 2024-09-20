import { type NextApiRequest, type NextApiResponse } from "next";
import { env } from "@/env.mjs";
import { createSdk } from "@compilot/js-sdk";
import { CustomerRepo } from "@/db/customer.repo";
import "@/configureDemoEnv";

const apiClient = createSdk({
  webhookSecret: env.COMPILOT_WEBHOOK_SECRET_KYC_AIRDROP,
  apiKey: env.COMPILOT_API_KEY_KYC_AIRDROP,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  console.log("Received webhook event", req.body);

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
      if (!event.payload.status) {
        console.error("No status found in the event payload", event.payload);
        return res.status(400).json({ message: "No status found" });
      }

      if (!event.payload.externalCustomerId) {
        throw new Error("No externalClientId in payload");
      }
      const myUserId = parseInt(event.payload.externalCustomerId, 10);
      // upsert the customer in the project database for fast access
      await CustomerRepo.updateById({
        id: myUserId,
        compilotCustomerId: event.payload.customerId,
        userStatus: event.payload.status,
      });
    }

    // it's important to answer 200 when the webhook is processed successfully
    res.status(200).json({ message: "Customer status updated successfully" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(400).json({ message: "Invalid payload" });
  }
}
