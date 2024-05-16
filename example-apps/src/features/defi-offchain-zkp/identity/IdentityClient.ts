import { env } from "@/env.mjs";
import { IdentityClient } from "@nexeraid/identity-sdk";

/**
 * Identity client instance initialized with the environment.
 * env property is not required, it defaults to prod.
 */
export const IDENTITY_CLIENT = new IdentityClient({
  env: env.NEXT_PUBLIC_ENVIRONMENT,
});
