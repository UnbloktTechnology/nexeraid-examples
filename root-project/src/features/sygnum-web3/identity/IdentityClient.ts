import { env } from "@/env.mjs";
import { IdentityClient } from "@nexeraid/identity-sdk";

export const IDENTITY_CLIENT  = new IdentityClient({
    env: env.NEXT_PUBLIC_ENVIRONMENT,
  })
