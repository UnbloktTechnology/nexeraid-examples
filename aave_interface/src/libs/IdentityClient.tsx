import { IdentityClient } from '@nexeraid/identity-sdk';

export const IDENTITY_CLIENT = new IdentityClient({
  env: process.env.NEXT_PUBLIC_NEXERA_ENVIRONMENT,
});
