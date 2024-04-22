import { useMutation } from "@tanstack/react-query";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { fetchAccessToken } from "@/utils/fetchAccessToken";
import { useSignMessage } from "wagmi";
import { type Address } from "viem";
import { buildSignatureMessage } from "@nexeraid/identity-sdk";

export const useKycBankWeb3Authentication = () => {
  const authStore = useAuthStore((state) => state);
  const { signMessageAsync } = useSignMessage();

  const logout = useMutation({
    mutationFn: async () => {
      await Promise.resolve(authStore.logout());
    },
  });

  const authenticate = useMutation({
    mutationFn: async (variables: { user: Address }) => {
      const signingMessage = buildSignatureMessage(variables.user);
      const signature = await signMessageAsync({ message: signingMessage });

      const response = await fetchAccessToken(
        {
          address: variables.user,
          blockchainNamespace: "eip115",
        },
        "bank-web3",
      );
      const { accessToken } = response;
      return {
        accessToken,
        signingMessage,
        signature,
        testUser: variables.user,
      };
    },
    onSuccess: (data) => {
      authStore.authenticate(
        data.accessToken,
        data.signingMessage,
        data.signature,
        data.testUser,
      );
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    authenticate,
    logout,
    accessToken: authStore.accessToken,
    signingMessage: authStore.signingMessage,
    signature: authStore.signature,
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
    isIdentityClientInit: authStore.isIdentityClientInit,
    setIsIdentityClientInit: authStore.setIsIdentityClientInit,
  };
};

interface IAuthStore {
  accessToken?: string;
  signingMessage?: string;
  signature?: string;
  isAuthenticated: boolean;
  isIdentityClientInit: boolean;
  user?: Address;
  setIsIdentityClientInit: (isInit: boolean) => void;
  authenticate: (
    accessToken: string,
    signingMessage: string,
    signature: string,
    user: Address,
  ) => void;
  logout: () => void;
}

const useAuthStore = create<IAuthStore>()(
  devtools(
    persist(
      immer((set) => ({
        accessToken: undefined,
        signature: undefined,
        signingMessage: undefined,
        isAuthenticated: false,
        isIdentityClientInit: false,
        setIsIdentityClientInit: (isInit) => {
          set((state) => {
            state.isIdentityClientInit = isInit;
          });
        },
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
        name: "bank-demo-auth-store",
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  ),
);
