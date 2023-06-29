import KycClient from "@nexeraid/kyc-sdk/client";
import { useMutation } from "@tanstack/react-query";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { api } from "@/utils/api";
import { getSigner, TestUser } from "@/appConfig";
import { useContext } from "react";
import { SimpleAuthContext } from "@/features/SimpleAuthProvider";

export const useKycAuthentication = () => {
  const authStore = useAuthStore((state) => state);
  const getAccessToken = api.access.accessToken.useMutation();
  const { getUser } = useContext(SimpleAuthContext);
  const user = getUser();

  const logout = useMutation(async () => {
    await Promise.resolve(authStore.logout());
  });

  const authenticate = useMutation(
    async (variables: { user: TestUser }) => {
      if (!variables.user.walletAddress)
        throw new Error("Missing data to authenticate");
      const signingMessage = KycClient.buildSignatureMessage(
        variables.user.walletAddress
      );
      const signer = getSigner(variables.user);
      const signature = await signer.signMessage(signingMessage);
      const response = await getAccessToken.mutateAsync({
        address: variables.user.walletAddress,
      });
      const { accessToken } = response;
      return {
        accessToken,
        signingMessage,
        signature,
      };
    },
    {
      onSuccess: (data) => {
        authStore.authenticate(
          data.accessToken,
          data.signingMessage,
          data.signature
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
  };
};

interface IAuthStore {
  accessToken?: string;
  signingMessage?: string;
  signature?: string;
  isAuthenticated: boolean;
  authenticate: (
    accessToken: string,
    signingMessage: string,
    signature: string
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
        authenticate: (
          accessToken: string,
          signingMessage: string,
          signature: string
        ) => {
          set((state) => {
            state.accessToken = accessToken;
            state.signingMessage = signingMessage;
            state.signature = signature;
            state.isAuthenticated = true;
          });
        },
        logout: () => {
          set((state) => {
            state.accessToken = undefined;
            state.signingMessage = undefined;
            state.signature = undefined;
            state.isAuthenticated = false;
          });
        },
      })),
      {
        name: "bank-demo-auth-store",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
