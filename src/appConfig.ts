import { z } from "zod";

export const ENVS = ["local", "dev", "staging", "prod"] as const;
export const ENVSchema = z.enum(ENVS);

export const appConfig = {
  [ENVSchema.enum.local]: {
    api: "http://localhost:3001/",
    apiKey: "6e9e57c3-0f53-4643-90ac-e420fff21ef7",
    kycApp: "http://localhost:3008/",
  },
  [ENVSchema.enum.dev]: {
    api: "https://api-dev.nexera.id/",
    apiKey: "db449699-152c-43fa-87dc-d6aa1e7aeb89",
    kycApp: "https://kyc-dev.nexera.id/",
  },
  [ENVSchema.enum.staging]: {
    api: "https://api-staging.nexera.id/",
    apiKey: "",
    kycApp: "https://nexera-id-kyc-app-monorepo.vercel.app/",
  },
  [ENVSchema.enum.prod]: {
    api: "https://api.nexera.id/",
    apiKey: "7a2f9b1e-cd9d-466c-97a7-9ea25aad465b",
    kycApp: "https://kyc.nexera.id/",
  },
} as const;
