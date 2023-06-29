import { env } from "@/env.mjs";
import KycClient from "@nexeraid/kyc-sdk/client";

export const KYC_CLIENTS = {
  verify: new KycClient({
    identifier: "verify",
    env: env.NEXT_PUBLIC_ENVIRONMENT,
  }),
  management: new KycClient({
    identifier: "management",
    env: env.NEXT_PUBLIC_ENVIRONMENT,
  }),
};
