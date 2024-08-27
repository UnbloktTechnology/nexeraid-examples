import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NEXERA_ID_API_KEY_KYC_AIRDROP: z.string(),
    NEXERA_ID_WORKFLOW_ID_KYC_AIRDROP: z.string(),
    NEXERA_ID_WORKSPACE_ID: z.string(),
    DATABASE_URL: z
      .string()
      .default("postgresql://postgres:postgres@localhost:5432/postgres"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_ENVIRONMENT: z
      .enum(["local", "dev", "stage", "prod", "test-dev-1", "test-dev-2"])
      .describe("The environment the app is running in")
      .default("prod"),
    NEXT_PUBLIC_AMOY_WS_PROVIDER_URL: z
      .string()
      .describe("Amoy websocket url for better event support"),
    NEXT_PUBLIC_SEPOLIA_WS_PROVIDER_URL: z
      .string()
      .describe("Sepolia websocket url for better event support"),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NEXERA_ID_WORKSPACE_ID: process.env.NEXERA_ID_WORKSPACE_ID,
    NEXERA_ID_API_KEY_KYC_AIRDROP: process.env.NEXERA_ID_API_KEY_KYC_AIRDROP,
    NEXERA_ID_WORKFLOW_ID_KYC_AIRDROP:
      process.env.NEXERA_ID_WORKFLOW_ID_KYC_AIRDROP,
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
    NEXT_PUBLIC_AMOY_WS_PROVIDER_URL:
      process.env.NEXT_PUBLIC_AMOY_WS_PROVIDER_URL,
    NEXT_PUBLIC_SEPOLIA_WS_PROVIDER_URL:
      process.env.NEXT_PUBLIC_SEPOLIA_WS_PROVIDER_URL,
    DATABASE_URL: process.env.DATABASE_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
