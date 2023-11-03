import { appConfig, ENVSchema } from '../utils/nexeraAppConfig';

export const getNexeraIDAccessToken = async (address: string) => {
  const apiHost = appConfig[ENVSchema.parse(process.env.NEXT_PUBLIC_NEXERA_ENVIRONMENT)].api;
  console.log('apiHost', apiHost);
  const response = await fetch(`${apiHost}kyc/auth/access-token`, {
    body: JSON.stringify({ address: address }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NEXERA_ID_API_KEY}`,
    },
    method: 'POST',
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { accessToken } = await response.json();
  console.log('response', accessToken);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return { accessToken: accessToken as string };
};
