import { buildSignatureMessage } from '@nexeraid/identity-sdk';
import { useMutation } from '@tanstack/react-query';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { getNexeraIDAccessToken } from '../../services/NexeraIDAccessToken';
import { useWeb3Context } from './useWeb3Context';

export const useKycAuthentication = () => {
  const authStore = useAuthStore((state) => state);
  const { provider } = useWeb3Context();

  const logout = useMutation(async () => {
    await Promise.resolve(authStore.logout());
  });

  const authenticate = useMutation(
    async (variables: { user: string }) => {
      const signer = provider?.getSigner();

      const signingMessage = buildSignatureMessage(variables.user);
      const signature = (await signer?.signMessage(signingMessage)) as string;
      const response = await getNexeraIDAccessToken(variables.user);

      console.log('RESPONSE', response);

      const { accessToken } = response;

      return {
        accessToken,
        signingMessage,
        signature,
        testUser: variables.user,
      };
    },
    {
      onSuccess: (data) => {
        authStore.authenticate(
          data.accessToken,
          data.signingMessage,
          data.signature,
          data.testUser
        );
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  return {
    authenticate,
    logout,
    accessToken: authStore.accessToken,
    signingMessage: authStore.signingMessage,
    signature: authStore.signature,
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
  };
};

interface IAuthStore {
  accessToken?: string;
  signingMessage?: string;
  signature?: string;
  isAuthenticated: boolean;
  user?: string;
  authenticate: (
    accessToken: string,
    signingMessage: string,
    signature: string,
    user: string
  ) => void;
  logout: () => void;
}

export const useAuthStore = create<IAuthStore>()(
  devtools(
    persist(
      immer((set) => ({
        accessToken: undefined,
        signature: undefined,
        signingMessage: undefined,
        isAuthenticated: false,
        authenticate: (accessToken, signingMessage, signature, user) => {
          set((state) => {
            state.accessToken = accessToken;
            state.signingMessage = signingMessage;
            state.signature = signature;
            state.isAuthenticated = true;
            state.user = user;
          });
        },
        logout: () => {
          set((state) => {
            state.accessToken = undefined;
            state.signingMessage = undefined;
            state.signature = undefined;
            state.isAuthenticated = false;
            state.user = undefined;
          });
        },
      })),
      {
        name: 'aave-interface-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
