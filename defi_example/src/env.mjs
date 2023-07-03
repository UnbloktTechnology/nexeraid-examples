import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXERA_SCENARIO_ID: z.string().describe("Specific Scenario ID for the APP"),
    NEXERA_ID_API_KEY: z.string().describe("The API key for the Nexera ID API -> https://dashboard.nexera.id/: Nexera DEFi Example Dapp"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_ENVIRONMENT: z.enum(["local", "dev", "stage", "prod"]).describe("The environment the app is running in"),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
    NEXERA_ID_API_KEY: process.env.NEXERA_ID_API_KEY,
    NEXERA_SCENARIO_ID: process.env.NEXERA_SCENARIO_ID,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
