import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";


export const ENVS = ["local", "dev", "staging", "prod"]
export const ENVSchema = z.enum(ENVS);
export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_ENVIRONMENT: ENVSchema,
  },
  runtimeEnv: {
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
  },
});
