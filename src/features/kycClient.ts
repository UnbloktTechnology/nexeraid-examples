import KycClient from "@nexeraid/kyc-sdk/client";
import { appConfig } from "../appConfig";
import { env } from "../env.mjs";

export const KYC_CLIENT = new KycClient({
  baseUrl: appConfig[env.NEXT_PUBLIC_ENVIRONMENT].kycApp,
});