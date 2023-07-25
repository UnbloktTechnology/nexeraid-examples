import { env } from "@/env.mjs";
import KycClient from "@nexeraid/kyc-sdk/client";

export const KYC_CLIENT  = new KycClient({
    env: env.NEXT_PUBLIC_ENVIRONMENT,
  })
