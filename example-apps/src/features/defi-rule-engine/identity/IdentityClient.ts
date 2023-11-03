import { env } from "@/env.mjs";
import { IdentityClient } from "@nexeraid/identity-sdk";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
export const IDENTITY_CLIENT = new IdentityClient({
  env: env.NEXT_PUBLIC_ENVIRONMENT,
})
