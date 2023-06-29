import { env } from "@/env.mjs";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { z } from "zod";
import { appConfig } from "@/appConfig";

export const accessRouter = createTRPCRouter({
  accessToken: publicProcedure
    .meta({
      openapi: {
        path: "/access-token",
        method: "GET",
        description: "Get user access token.",
        summary: "Endpoint for getting the access token of the KYC Client",
      },
    })
    .input(
      z.object({
        address: z.string(),
      })
    )
    .output(z.any())
    .mutation(async ({ input }) => {
      const apiHost = appConfig[env.NEXT_PUBLIC_ENVIRONMENT].api;
      const response = await fetch(`${apiHost}kyc/auth/access-token`, {
        body: JSON.stringify({ address: input.address }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.NEXERA_ID_API_KEY}`,
        },
        method: "POST",
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { accessToken } = await response.json();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return { accessToken: accessToken as string };
    }),
});
