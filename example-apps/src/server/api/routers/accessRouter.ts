import { env } from "@/env.mjs";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { z } from "zod";
import { appConfig } from "@/appConfig";

export const accessRouter = createTRPCRouter({
  defiRuleEngineAccessToken: publicProcedure
    .input(
      z.object({
        address: z.string(),
      }),
    )
    .output(z.any())
    .mutation(async ({ input }) => {
      const apiHost = appConfig[env.NEXT_PUBLIC_ENVIRONMENT].api;
      console.log("apiHost", apiHost);
      const response = await fetch(`${apiHost}kyc/auth/access-token`, {
        body: JSON.stringify({ address: input.address }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.NEXERA_ID_API_KEY_DEFI_RULE_ENGINE}`,
        },
        method: "POST",
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { accessToken } = await response.json();
      console.log("response", accessToken);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      if (!accessToken) {
        throw new Error("No access token");
      }
      return { accessToken: accessToken as string };
    }),
  defiOffChainZKPAccessToken: publicProcedure
    .input(
      z.object({
        address: z.string(),
      }),
    )
    .output(z.any())
    .mutation(async ({ input }) => {
      const apiHost = appConfig[env.NEXT_PUBLIC_ENVIRONMENT].api;
      console.log("apiHost", apiHost);
      const response = await fetch(`${apiHost}kyc/auth/access-token`, {
        body: JSON.stringify({ address: input.address }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.NEXERA_ID_API_KEY_DEFI_OFFCHAIN_ZKP}`,
        },
        method: "POST",
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { accessToken } = await response.json();
      console.log("response", accessToken);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return { accessToken: accessToken as string };
    }),
  bankAccessToken: publicProcedure
    .input(
      z.object({
        address: z.string(),
      }),
    )
    .output(z.any())
    .mutation(async ({ input }) => {
      const apiHost = appConfig[env.NEXT_PUBLIC_ENVIRONMENT].api;
      console.log("apiHost", apiHost);
      const response = await fetch(`${apiHost}kyc/auth/access-token`, {
        body: JSON.stringify({ address: input.address }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.NEXERA_ID_API_KEY_BANK}`,
        },
        method: "POST",
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { accessToken } = await response.json();
      console.log("response", accessToken);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return { accessToken: accessToken as string };
    }),
  bankWeb3AccessToken: publicProcedure
    .input(
      z.object({
        address: z.string(),
      }),
    )
    .output(z.any())
    .mutation(async ({ input }) => {
      const apiHost = appConfig[env.NEXT_PUBLIC_ENVIRONMENT].api;
      console.log("apiHost", apiHost);
      const response = await fetch(`${apiHost}kyc/auth/access-token`, {
        body: JSON.stringify({ address: input.address }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.NEXERA_ID_API_KEY_BANK_WEB3}`,
        },
        method: "POST",
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { accessToken } = await response.json();
      console.log("response", accessToken);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return { accessToken: accessToken as string };
    }),
  kycAccessToken: publicProcedure
    .input(
      z.object({
        address: z.string(),
      }),
    )
    .output(z.any())
    .mutation(async ({ input }) => {
      const apiHost = appConfig[env.NEXT_PUBLIC_ENVIRONMENT].api;
      console.log("apiHost", apiHost);
      const response = await fetch(`${apiHost}kyc/auth/access-token`, {
        body: JSON.stringify({ wallet: input.address }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.NEXERA_ID_API_KEY_KYC}`,
        },
        method: "POST",
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { accessToken } = await response.json();
      console.log("response", accessToken);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return { accessToken: accessToken as string };
    }),
  bankSygnumWeb3AccessToken: publicProcedure
    .input(
      z.object({
        address: z.string(),
      }),
    )
    .output(z.any())
    .mutation(async ({ input }) => {
      const apiHost = appConfig[env.NEXT_PUBLIC_ENVIRONMENT].api;
      console.log("apiHost", apiHost);
      const response = await fetch(`${apiHost}kyc/auth/access-token`, {
        body: JSON.stringify({ address: input.address }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.NEXERA_ID_API_KEY_BANK_SYGNUM_WEB3}`,
        },
        method: "POST",
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { accessToken } = await response.json();
      console.log("response", accessToken);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return { accessToken: accessToken as string };
    }),
});
