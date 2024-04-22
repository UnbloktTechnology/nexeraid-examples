import { buildSignatureMessage } from "@nexeraid/identity-sdk";
import { useMutation } from "@tanstack/react-query";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { fetchAccessToken } from "@/utils/fetchAccessToken";
import { getSigner, type TestUser } from "@/appConfig";

export const useBankKycAuthentication = () => {
  const authStore = useAuthStore((state) => state);

  const logout = useMutation({
    mutationFn: async () => {
      await Promise.resolve(authStore.logout());
    },
  });

  const authenticate = useMutation({
    mutationFn: async (variables: { user: TestUser }) => {
      if (!variables.user.walletAddress)
        throw new Error("Missing data to authenticate");
      const signingMessage = buildSignatureMessage(
        variables.user.walletAddress,
      );
      const signer = getSigner(variables.user);
      const signature = await signer.signMessage(signingMessage);
      const response = await fetchAccessToken(
        {
          address: variables.user.walletAddress,
          blockchainNamespace: "eip115",
        },
        "bank",
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
    isIdentityClientInit: authStore.isIdentityClientInit,
    setIsIdentityClientInit: authStore.setIsIdentityClientInit,
    user: authStore.user,
  };
};

interface IAuthStore {
  accessToken?: string;
  signingMessage?: string;
  signature?: string;
  isAuthenticated: boolean;
  user?: TestUser;
  isIdentityClientInit: boolean;
  setIsIdentityClientInit: (isInit: boolean) => void;
  authenticate: (
    accessToken: string,
    signingMessage: string,
    signature: string,
    user: TestUser,
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
        setIsIdentityClientInit: (isInit: boolean) => {
          set((state) => {
            state.isIdentityClientInit = isInit;
          });
        },
        authenticate: (
          accessToken: string,
          signingMessage: string,
          signature: string,
          user: TestUser,
        ) => {
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
        name: "bank",
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  ),
);
