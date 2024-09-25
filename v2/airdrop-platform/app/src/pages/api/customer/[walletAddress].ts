import type { NextApiRequest, NextApiResponse } from "next";

import "@/configureDemoEnv";
import { CustomerRepo } from "@/db/customer.repo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const walletAddress = req.query.walletAddress;
  if (!walletAddress || typeof walletAddress !== "string") {
    res.status(400).json({ error: "Invalid wallet address" });
    return;
  }

  try {
    const maybeCustomer = await CustomerRepo.searchByAddress(walletAddress);
    if (!maybeCustomer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }
    res.status(200).json({ customer: maybeCustomer });
  } catch (error) {
    console.error("API call error:", error);
    res.status(500).json({ error: "Failed to fetch customer status" });
  }
}
