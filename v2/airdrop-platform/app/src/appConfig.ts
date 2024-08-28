import { z } from "zod";

export const ENVS = [
  "local",
  "dev",
  "stage",
  "prod",
  "test-dev-1",
  "test-dev-2",
] as const;
export const ENVSchema = z.enum(ENVS);

export const appConfig = {
  [ENVSchema.enum.local]: {
    api: "http://localhost:3001/",
  },
  [ENVSchema.enum.dev]: {
    api: "https://api-dev.nexera.id/",
  },
  [ENVSchema.enum["test-dev-1"]]: {
    api: "https://api-test-dev-1.nexera.id/",
  },
  [ENVSchema.enum["test-dev-2"]]: {
    api: "https://api-test-dev-2.nexera.id/",
  },
  [ENVSchema.enum.stage]: {
    api: "https://api-staging.nexera.id/",
  },
  [ENVSchema.enum.prod]: {
    api: "https://api.nexera.id/",
  },
} as const;