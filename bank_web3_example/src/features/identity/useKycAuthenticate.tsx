import { useMutation } from "@tanstack/react-query";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { api } from "@/utils/api";
import { type ConnectorData, useAccount, useSignMessage } from "wagmi";
import { type Address } from "viem";
import { buildSignatureMessage } from "@nexeraid/identity-sdk";
import { useEffect } from "react";

export const useKycAuthentication = () => {
  const authStore = useAuthStore((state) => state);
  const getAccessToken = api.access.accessToken.useMutation();
  const { signMessageAsync } = useSignMessage();
  const { connector: activeConnector } = useAccount();

  useEffect(() => {
    const handleConnectorUpdate = ({ account, chain }: ConnectorData) => {
      if (account) {
        console.log("new account", account);
        logout.mutate();
        window.location.reload();
      } else if (chain) {
        console.log("new chain", chain);
        logout.mutate();
      }
    };

    if (activeConnector) {
      activeConnector.on("change", handleConnectorUpdate);
    }

    return () => {
      activeConnector?.off("change", handleConnectorUpdate);
    };
  }, [activeConnector]);

  const logout = useMutation(async () => {
    await Promise.resolve(authStore.logout());
  });

  const authenticate = useMutation(
    async (variables: { user: Address }) => {
      const signingMessage = buildSignatureMessage(variables.user);
      const signature = await signMessageAsync({ message: signingMessage });
      const response = await getAccessToken.mutateAsync({
        address: variables.user,
      });
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
  user?: Address;
  authenticate: (
    accessToken: string,
    signingMessage: string,
    signature: string,
    user: Address
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
      }
    )
  )
);
