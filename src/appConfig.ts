import { z } from "zod";
import { Redis } from "@upstash/redis";
import KycClient from "@nexeraid/kyc-sdk/client";

export const ENVS = ["local", "dev", "stage", "prod"] as const;
export const ENVSchema = z.enum(ENVS);

export const appConfig = {
  [ENVSchema.enum.local]: {
    api: "http://localhost:3001/",
  },
  [ENVSchema.enum.dev]: {
    api: "https://api-dev.nexera.id/",
  },
  [ENVSchema.enum.stage]: {
    api: "https://api-staging.nexera.id/",
  },
  [ENVSchema.enum.prod]: {
    api: "https://api.nexera.id/",
  },
} as const;

export const KYC_CLIENT = new KycClient({
  env: ENVSchema.parse(process.env.NEXT_PUBLIC_ENVIRONMENT),
});
