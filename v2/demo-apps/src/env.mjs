import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    UPSTASH_REDIS_REST_TOKEN: z
      .string()
      .describe(
        "The token for the Upstash Redis REST API -> https://console.upstash.com/redis/",
      ),
    UPSTASH_REDIS_REST_URL: z
      .string()
      .describe(
        "The URL of the Upstash Redis REST API -> https://console.upstash.com/redis/",
      ),

    NEXERA_ID_WEBHOOK_SECRET_DEFI_RULE_ENGINE: z
      .string()
      .optional()
      .default("changeme")
      .describe(
        "The webhook secret for the Nexera ID API -> https://dashboard.nexera.id/: Nexera Defi Rule Engine Example dApp",
      ),
    NEXERA_ID_API_KEY_DEFI_RULE_ENGINE: z
      .string()
      .describe(
        "The API key for the Nexera ID API -> https://dashboard.nexera.id/: Nexera Defi Rule Engine Example dApp",
      ),
    NEXERA_ID_WORKFLOW_ID_DEFI_RULE_ENGINE: z
      .string()
      .describe(
        "The workflow ID for the Nexera ID API -> https://dashboard.nexera.id/: Nexera Defi Rule Engine Example dApp",
      ),

    NEXERA_ID_WEBHOOK_SECRET_DEFI_OFFCHAIN_ZKP: z
      .string()
      .optional()
      .default("changeme")
      .describe(
        "The webhook secret for the Nexera ID API -> https://dashboard.nexera.id/: Nexera Defi Offchain ZKP Example dApp",
      ),
    NEXERA_ID_API_KEY_DEFI_OFFCHAIN_ZKP: z
      .string()
      .describe(
        "The API key for the Nexera ID API -> https://dashboard.nexera.id/: Nexera Defi Offchain ZKP Example dApp",
      ),
    NEXERA_ID_WORKFLOW_ID_DEFI_OFFCHAIN_ZKP: z
      .string()
      .describe(
        "The workflow ID for the Nexera ID API -> https://dashboard.nexera.id/: Nexera Defi Offchain ZKP Example dApp",
      ),

    NEXERA_ID_WEBHOOK_SECRET_BANK: z
      .string()
      .optional()
      .default("changeme")
      .describe(
        "The webhook secret for the Nexera ID API -> https://dashboard.nexera.id/: Nexera Bank App",
      ),
    NEXERA_ID_API_KEY_BANK: z
      .string()
      .describe(
        "The API key for the Nexera ID API -> https://dashboard.nexera.id/: Nexera Bank App",
      ),
    NEXERA_ID_WORKFLOW_ID_BANK: z
      .string()
      .describe(
        "The workflow ID for the Nexera ID API -> https://dashboard.nexera.id/: Nexera Bank App",
      ),

    NEXERA_ID_WEBHOOK_SECRET_BANK_WEB3: z
      .string()
      .optional()
      .default("changeme")
      .describe(
        "The webhook secret for the Nexera ID API -> https://dashboard.nexera.id/: Nexera Bank Web3 dApp",
      ),
    NEXERA_ID_API_KEY_BANK_WEB3: z
      .string()
      .describe(
        "The API key for the Nexera ID API -> https://dashboard.nexera.id/: Nexera Bank Web3 dApp",
      ),
    NEXERA_ID_WORKFLOW_ID_BANK_WEB3: z
      .string()
      .describe(
        "The workflow ID for the Nexera ID API -> https://dashboard.nexera.id/: Nexera Bank Web3 dApp",
      ),

    NEXERA_ID_WEBHOOK_SECRET_BANK_KYB: z
      .string()
      .optional()
      .default("changeme")
      .describe(
        "The webhook secret for the Nexera ID API -> https://dashboard.nexera.id/: Nexera Bank Web3 dApp Mocked",
      ),
    NEXERA_ID_API_KEY_BANK_KYB: z
      .string()
      .describe(
        "The API key for the Nexera ID API -> https://dashboard.nexera.id/: Nexera Bank Web3 dApp Mocked",
      ),
    NEXERA_ID_WORKFLOW_ID_BANK_KYB: z
      .string()
      .describe(
        "The workflow ID for the Nexera ID API -> https://dashboard.nexera.id/: Nexera Bank Web3 dApp Mocked",
      ),

    NEXERA_ID_WEBHOOK_SECRET_KYC: z
      .string()
      .optional()
      .default("changeme")
      .describe(
        "The webhook secret for the Nexera ID API -> https://dashboard.nexera.id/: Nexera KYC dApp",
      ),
    NEXERA_ID_API_KEY_KYC: z
      .string()
      .describe(
        "The API key for the Nexera ID API -> https://dashboard.nexera.id/: Nexera KYC dApp",
      ),
    NEXERA_ID_WORKFLOW_ID_KYC: z
      .string()
      .describe(
        "The workflow ID for the Nexera ID API -> https://dashboard.nexera.id/: Nexera KYC dApp",
      ),

    NEXERA_ID_WEBHOOK_SECRET_MULTICHAIN_DEMO: z
      .string()
      .optional()
      .default("changeme")
      .describe(
        "The webhook secret for the Nexera ID API -> https://dashboard.nexera.id/: Nexera Multichain Demo dApp",
      ),
    NEXERA_ID_API_KEY_MULTICHAIN_DEMO: z
      .string()
      .describe(
        "The API key for the Nexera ID API -> https://dashboard.nexera.id/: Nexera Multichain Demo dApp",
      ),
    NEXERA_ID_WORKFLOW_ID_MULTICHAIN_DEMO: z
      .string()
      .describe(
        "The workflow ID for the Nexera ID API -> https://dashboard.nexera.id/: Nexera Multichain Demo dApp",
      ),
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
    NEXT_PUBLIC_AMOY_HTTP_PROVIDER_URL: z
      .string()
      .describe("Amoy websocket url for better event support"),
    NEXT_PUBLIC_SEPOLIA_HTTP_PROVIDER_URL: z
      .string()
      .describe("Sepolia websocket url for better event support"),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    NEXT_PUBLIC_AMOY_HTTP_PROVIDER_URL:
      process.env.NEXT_PUBLIC_AMOY_HTTP_PROVIDER_URL,
    NEXT_PUBLIC_SEPOLIA_HTTP_PROVIDER_URL:
      process.env.NEXT_PUBLIC_SEPOLIA_HTTP_PROVIDER_URL,

    NEXERA_ID_WEBHOOK_SECRET_BANK: process.env.NEXERA_ID_WEBHOOK_SECRET_BANK,
    NEXERA_ID_API_KEY_BANK: process.env.NEXERA_ID_API_KEY_BANK,
    NEXERA_ID_WORKFLOW_ID_BANK: process.env.NEXERA_ID_WORKFLOW_ID_BANK,

    NEXERA_ID_WEBHOOK_SECRET_BANK_KYB:
      process.env.NEXERA_ID_WEBHOOK_SECRET_BANK_KYB,
    NEXERA_ID_API_KEY_BANK_KYB: process.env.NEXERA_ID_API_KEY_BANK_KYB,
    NEXERA_ID_WORKFLOW_ID_BANK_KYB: process.env.NEXERA_ID_WORKFLOW_ID_BANK_KYB,

    NEXERA_ID_WEBHOOK_SECRET_BANK_WEB3:
      process.env.NEXERA_ID_WEBHOOK_SECRET_BANK_WEB3,
    NEXERA_ID_API_KEY_BANK_WEB3: process.env.NEXERA_ID_API_KEY_BANK_WEB3,
    NEXERA_ID_WORKFLOW_ID_BANK_WEB3:
      process.env.NEXERA_ID_WORKFLOW_ID_BANK_WEB3,

    NEXERA_ID_WEBHOOK_SECRET_DEFI_RULE_ENGINE:
      process.env.NEXERA_ID_WEBHOOK_SECRET_DEFI_RULE_ENGINE,
    NEXERA_ID_API_KEY_DEFI_RULE_ENGINE:
      process.env.NEXERA_ID_API_KEY_DEFI_RULE_ENGINE,
    NEXERA_ID_WORKFLOW_ID_DEFI_RULE_ENGINE:
      process.env.NEXERA_ID_WORKFLOW_ID_DEFI_RULE_ENGINE,

    NEXERA_ID_WEBHOOK_SECRET_DEFI_OFFCHAIN_ZKP:
      process.env.NEXERA_ID_WEBHOOK_SECRET_DEFI_OFFCHAIN_ZKP,
    NEXERA_ID_API_KEY_DEFI_OFFCHAIN_ZKP:
      process.env.NEXERA_ID_API_KEY_DEFI_OFFCHAIN_ZKP,
    NEXERA_ID_WORKFLOW_ID_DEFI_OFFCHAIN_ZKP:
      process.env.NEXERA_ID_WORKFLOW_ID_DEFI_OFFCHAIN_ZKP,

    NEXERA_ID_WEBHOOK_SECRET_KYC: process.env.NEXERA_ID_WEBHOOK_SECRET_KYC,
    NEXERA_ID_API_KEY_KYC: process.env.NEXERA_ID_API_KEY_KYC,
    NEXERA_ID_WORKFLOW_ID_KYC: process.env.NEXERA_ID_WORKFLOW_ID_KYC,

    NEXERA_ID_WEBHOOK_SECRET_MULTICHAIN_DEMO:
      process.env.NEXERA_ID_WEBHOOK_SECRET_MULTICHAIN_DEMO,
    NEXERA_ID_API_KEY_MULTICHAIN_DEMO:
      process.env.NEXERA_ID_API_KEY_MULTICHAIN_DEMO,
    NEXERA_ID_WORKFLOW_ID_MULTICHAIN_DEMO:
      process.env.NEXERA_ID_WORKFLOW_ID_MULTICHAIN_DEMO,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
