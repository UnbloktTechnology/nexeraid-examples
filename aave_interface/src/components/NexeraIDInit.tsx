import { Signer } from 'ethers';
import { useEffect } from 'react';

import { useKycAuthentication } from '../libs/hooks/useKycAuthenticate';
import { IDENTITY_CLIENT } from '../libs/IdentityClient';

export const NexeraIDInit = () => {
  const { accessToken, signingMessage, signature } = useKycAuthentication();

  useEffect(() => {
    const address = window?.address;

    if (address && accessToken && signingMessage && signature) {
      const signer: Signer = window.signer;

      IDENTITY_CLIENT.onSignMessage(async (data) => {
        console.log('on sign personal data');
        return await signer.signMessage(data.message);
      });
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
  }, [accessToken, signingMessage, signature]);

  return null;
};
