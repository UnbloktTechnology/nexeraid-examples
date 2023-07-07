import { z } from "zod";

export const ENVS = ["local", "dev", "stage", "prod"] as const;
export const ENVSchema = z.enum(ENVS);

export const appConfig = {
  [ENVSchema.enum.local]: {
    api: "http://localhost:3001/",
  },
  [ENVSchema.enum.dev]: {
    api: "https://api-dev-k8s.nexera.id/",
  },
  [ENVSchema.enum.stage]: {
    api: "https://api-staging.nexera.id/",
  },
  [ENVSchema.enum.prod]: {
    api: "https://api.nexera.id/",
  },
} as const;
