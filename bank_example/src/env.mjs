import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXERA_SCENARIO_ID: z.string().default('6491f9bf20410c15798b1dd1').describe("Specific Scenario ID for the APP"),
    UPSTASH_REDIS_REST_TOKEN: z.string().default("=AXcgASQgZmQ5ZWJhMTktNzQ5Zi00MzUzLTg5MDQtZWM1MmRiZmRkNjU2MTUxMWFjZjY4MDhiNDRkYTk1MjgzN2IxMzEzZDVmMGE="),
    UPSTASH_REDIS_REST_URL: z.string().default("https://eu2-chief-puma-30496.upstash.io"),
    NEXERA_ID_API_KEY: z.string().optional().default("c89910dd-d71b-49e9-af59-4ba016ab48cc").describe("The API key for the Nexera ID API -> https://cms.nexera.id/: Nexera Example Dapp"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_ENVIRONMENT: z.enum(["local", "dev", "stage", "prod"]).default("local").describe("The environment the app is running in"),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBNEXT_PUBLIC_ENVIRONMENT,
    NEXERA_ID_API_KEY: process.env.NEXERA_ID_API_KEY,
    NEXERA_SCENARIO_ID: process.env.NEXERA_SCENARIO_ID,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
