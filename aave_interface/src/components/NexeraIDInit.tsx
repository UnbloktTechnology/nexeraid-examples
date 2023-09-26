import { useEffect } from 'react';

import { useKycAuthentication } from '../libs/hooks/useKycAuthenticate';
import { useWeb3Context } from '../libs/hooks/useWeb3Context';
import { IDENTITY_CLIENT } from '../libs/IdentityClient';

export const NexeraIDInit = () => {
  const { accessToken, signingMessage, signature } = useKycAuthentication();
  const { provider, currentAccount } = useWeb3Context();

  useEffect(() => {
    if (currentAccount && accessToken && signingMessage && signature) {
      const signer = provider?.getSigner();

      if (signer) {
        IDENTITY_CLIENT.onSignMessage(async (data) => {
          console.log('on sign personal data');
          return await signer.signMessage(data.message);
        });
      }

      IDENTITY_CLIENT.onKycCompletion((data) => {
        void (() => {
          console.log('on kyc completion', data);
        })();
      });
      IDENTITY_CLIENT.init({
        accessToken,
        signingMessage,
        signature,
      });
    }
  }, [accessToken, signingMessage, signature, currentAccount, provider]);

  return null;
};
