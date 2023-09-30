import { useEffect } from 'react';

import { useKycAuthentication } from '../libs/hooks/useKycAuthenticate';
import { useWeb3Context } from '../libs/hooks/useWeb3Context';
import { IDENTITY_CLIENT } from '../libs/IdentityClient';

export const NexeraIDInit = () => {
  const { accessToken, signingMessage, signature } = useKycAuthentication();
  const { provider, currentAccount } = useWeb3Context();

  useEffect(() => {
    const signer = provider?.getSigner();
    const init = async (accessToken: string, signingMessage: string, signature: string) => {
      console.log('INIT!');
      await IDENTITY_CLIENT.init({
        accessToken,
        signingMessage,
        signature,
      });
      console.log('DONE!');
    };

    if (currentAccount && accessToken && signingMessage && signature && signer) {
      IDENTITY_CLIENT.onSignMessage(async (data) => {
        console.log('on sign personal data');
        return await signer.signMessage(data.message);
      });

      IDENTITY_CLIENT.onSendTransaction(async (data) => {
        const res = await signer.sendTransaction({
          from: data.accountAddress,
          to: data.to,
          data: data.data,
          value: data.value,
        });
        const receipt = await res.wait();

        return receipt.transactionHash;
      });

      IDENTITY_CLIENT.onKycCompletion((data) => {
        void (() => {
          console.log('on kyc completion', data);
        })();
      });

      void init(accessToken, signingMessage, signature);
    }
  }, [accessToken, signingMessage, signature, currentAccount, provider]);

  return null;
};
