import { useEffect } from "react";
import KycClient from "@nexeraid/kyc-sdk/client";
import { useMutation } from "@tanstack/react-query";
import { decodeJwt } from "jose";
import { useAccount, useSignMessage } from "wagmi";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { api } from "@/utils/api";

import { AddressSchema } from "@nexeraprotocol/nexera-id-schemas";

export const useKycAuthentication = () => {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const authStore = useAuthStore((state) => state);
  const getAccessToken = api.access.accessToken.useMutation();

  const logout = useMutation(async () => {
    await Promise.resolve(authStore.logout());
  });

  const authenticate = useMutation(
    async () => {
      if (!address) {
        throw new Error("Missing data to authenticate");
      }
      const signingMessage = KycClient.buildSignatureMessage(
        address.toLowerCase()
      );
      const signature = await signMessageAsync({ message: signingMessage });
      const response = await getAccessToken.mutateAsync({
        address: address.toLowerCase(),
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
        const validatedAddress = AddressSchema.parse(address);
        authStore.authenticate(
          validatedAddress,
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

  useEffect(() => {
    if (authStore.address && address) {
      if (authStore.address.toLowerCase() !== address.toLowerCase()) {
        logout.mutate();
      }
      if (authStore.accessToken) {
        const token = decodeJwt(authStore?.accessToken);
        if (!token.exp) throw new Error("Invalid token, missing token.EXP");
        const jwtDate = new Date(token.exp * 1000);
        // if jwt has more than 1 hour to live, use it
        const now = new Date();

        now.setHours(now.getHours() - 1);
        if (jwtDate < now) {
          logout.mutate();
        }
      }
    }
  }, [address, authStore.accessToken, authStore.address, logout]);

  return {
    authenticate,
    logout,
    accessToken: authStore.accessToken,
    signingMessage: authStore.signingMessage,
    signature: authStore.signature,
  };
};

interface IAuthStore {
  address?: string;
  accessToken?: string;
  signingMessage?: string;
  signature?: string;
  isAuthenticated: boolean;
  authenticate: (
    address: string,
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
        address: undefined,
        signature: undefined,
        signingMessage: undefined,
        isAuthenticated: false,
        authenticate: (address, accessToken, signingMessage, signature) => {
          set((state) => {
            state.address = address;
            state.accessToken = accessToken;
            state.signingMessage = signingMessage;
            state.signature = signature;
            state.isAuthenticated = true;
          });
        },
        logout: () => {
          set((state) => {
            state.address = undefined;
            state.accessToken = undefined;
            state.signingMessage = undefined;
            state.signature = undefined;
            state.isAuthenticated = false;
          });
        },
      })),
      {
        name: "kyc-demo-auth-store",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
