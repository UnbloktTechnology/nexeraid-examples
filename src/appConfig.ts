import { z } from "zod";

export const ENVS = ["local", "dev", "staging", "prod"] as const;
export const ENVSchema = z.enum(ENVS);

export const appConfig = {
  [ENVSchema.enum.local]: {
    alchemyProviderApiKey: "l17F_fBBtM6Tn1RNN_lXaXMc2Czt0tlA",
    api: "http://localhost:3001/",
    apiKey: "8038d25e-4ca4-45c2-8bff-642c47870cca",
    kycApp: "http://localhost:3008/",
  },
  [ENVSchema.enum.dev]: {
    alchemyProviderApiKey: "l17F_fBBtM6Tn1RNN_lXaXMc2Czt0tlA",
    api: "https://api-dev.nexera.id/",
    apiKey: "db449699-152c-43fa-87dc-d6aa1e7aeb89",
    kycApp: "https://kyc-dev.nexera.id/",
  },
  [ENVSchema.enum.staging]: {
    alchemyProviderApiKey: "l17F_fBBtM6Tn1RNN_lXaXMc2Czt0tlA",
    api: "https://api-staging.nexera.id/",
    apiKey: "",
    kycApp: "https://nexera-id-kyc-app-monorepo.vercel.app/",
  },
  [ENVSchema.enum.prod]: {
    alchemyProviderApiKey: "l17F_fBBtM6Tn1RNN_lXaXMc2Czt0tlA",
    api: "https://api.nexera.id/",
    apiKey: "7a2f9b1e-cd9d-466c-97a7-9ea25aad465b",
    kycApp: "https://kyc-dev.nexera.id/",
  },
} as const;
