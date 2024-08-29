import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";
import { getDb } from "@/db/db";
import {
  UuidString,
  ExternalCustomerId,
  RiskScoreType,
  CustomerType,
  CustomerOnboardingLevel,
  CustomerStatus,
} from "@nexeraid/identity-schemas";
import { env } from "@/env.mjs";
import { appConfig } from "@/appConfig";
import { customerStatus } from "@/db/schema";
import type { Address } from "viem";

// Import or define the CustomerWebhookPayload schema here
// TODO import from @nexeraid/identity-schemas or js-sdk
export const CustomerWebhookPayload = z.object({
  cmsProjectId: z.string(),
  customerId: UuidString,
  externalClientId: ExternalCustomerId.nullish(),
  createdBy: z.string(),
  updatedBy: z.string(),
  id: z.string(),
  riskScore: RiskScoreType.nullish(),
  type: CustomerType.nullish(),
  onboardingLevel: CustomerOnboardingLevel.nullish(),
  status: CustomerStatus.nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullish(),
  reason: z.string().nullish(),
  deletedBy: z.string().nullish(),
  deletedAt: z.coerce.date().nullish(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const payload = CustomerWebhookPayload.parse(req.body);
    const db = getDb();

    /**
     * curl -X 'GET' \
  'https://api.nexera.id/customers/121d5404-34fd-499f-b4a5-a2444de41e52/wallets' \
  -H 'accept: application/json'
     */
    // TODO use sdk
    const response = await fetch(
      `${appConfig[env.NEXT_PUBLIC_ENVIRONMENT].api}/customers/${payload.customerId}/wallets`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${env.NEXERA_ID_API_KEY_KYC_AIRDROP}`,
        },
      },
    );
    /**
     * [
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "wallet": "string",
    "blockchainNamespace": "tezos",
    "customerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "verified": true,
    "createdAt": "2024-08-28T23:19:44.940Z",
    "updatedAt": "2024-08-28T23:19:44.940Z",
    "createdBy": "string",
    "updatedBy": "string"
  }
]
     */
    const data = (await response.json()) as {
      id: string;
      wallet: string;
      blockchainNamespace: string;
      customerId: string;
      verified: boolean;
      createdAt: string;
      updatedAt: string;
    }[];
    console.log(data);

    const wallet = data[0]?.wallet;

    // Update the customer status in the database
    await db.insert(customerStatus).values({
      address: wallet as Address,
      status: payload.status!,
      updatedAt: new Date(),
    });

    res.status(200).json({ message: "Customer status updated successfully" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(400).json({ message: "Invalid payload" });
  }
}
