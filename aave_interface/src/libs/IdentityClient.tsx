import { IdentityClient } from '@nexeraid/identity-sdk';

import { ENVSchema } from '../utils/nexeraAppConfig';

export const IDENTITY_CLIENT = new IdentityClient({
  env: ENVSchema.parse(process.env.NEXT_PUBLIC_NEXERA_ENVIRONMENT),
});
