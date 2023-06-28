import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";


export const ENVS = ["local", "dev", "stage", "prod"]
export const ENVSchema = z.enum(ENVS);
export const env = createEnv({
  server: {
    UPSTASH_REDIS_REST_TOKEN: z.string(),
    UPSTASH_REDIS_REST_URL: z.string(),
    NEXERA_ID_API_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_ENVIRONMENT: ENVSchema,
  },
  runtimeEnv: {
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    NEXERA_ID_API_KEY: process.env.NEXERA_ID_API_KEY,
  },
});
