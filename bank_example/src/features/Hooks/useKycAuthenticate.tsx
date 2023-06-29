import { useEffect } from "react";
import KycClient from "@nexeraid/kyc-sdk/client";
import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";
import { decodeJwt } from "jose";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { api } from "@/utils/api";

export interface AuthenticationData {
  address: string;
  privateKey: string;
}

export const useKycAuthentication = () => {
  const authStore = useAuthStore((state) => state);

  const getAccessToken = api.access.accessToken.useMutation();

  const logout = useMutation(async () => {
    await Promise.resolve(authStore.logout());
  });

  const authenticate = useMutation(
    async (authenticateData: AuthenticationData) => {
      const { address, privateKey } = authenticateData;
      if (!address || !privateKey) {
        throw new Error("Missing data to authenticate");
      }

      const signingMessage = KycClient.buildSignatureMessage(address);
      const provider = new ethers.JsonRpcProvider(
        "https://ava-testnet.public.blastapi.io/ext/bc/C/rpc",
        43113
      );
      const signer = new ethers.Wallet(privateKey, provider);
      const signature = await signer.signMessage(signingMessage);
      const response = await getAccessToken.mutateAsync({ address });
      const { accessToken } = response;

      console.log("HELLOOOOO Access token: ", accessToken);
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

  useEffect(() => {
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
  }, [authStore.accessToken, logout]);

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
