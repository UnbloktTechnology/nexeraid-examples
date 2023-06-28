import { env } from "@/env.mjs";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { z } from "zod";
import { Redis } from "@upstash/redis";
import { api } from "@/utils/api";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
const redis = Redis.fromEnv();

export const APP_NAME = "example-backend";

export const identityRouter = createTRPCRouter({
  dataHook: publicProcedure
    .meta({
      openapi: {
        path: "/data-webhook",
        method: "POST",
        description: "Get user's mNFT balance.",
        tags: ["identity-verification"],
        protect: true,
        summary: "Endpoint registered in the kyc sdk to receive the data",
      },
    })
    .input(
      z.object({
        address: z.string(),
        data: z.any(),
      }),
    )
    .output(z.any())
    .mutation(async ({ input }) => {
      const key = `${APP_NAME}:verify:${input.address.toLowerCase()}`;
      console.log("key", key);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const result = await redis.set(key, input.data);
      console.log("result", result);
       
      const scenarioId = env.NEXERA_SCENARIO_ID

      console.log(
        `dataHook Using scenarioId ${scenarioId} - ${
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          input?.data?.idScan ? "gbg" : "sumsub"
        } for ${input.address}`,
      );

      // return await apiClient.complianceApi.complianceExecute({
      //   complianceExecuteRequest: {
      //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //     // @ts-ignore
      //     inputData: {
      //       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //       // @ts-ignore
      //       credentials: [credential],
      //     },
      //     address: input.address,
      //     scenarioId: scenarioId,
      //   },
      // });
      return true
    }),
  validateAddress: publicProcedure
    .meta({
      openapi: {
        path: "/verify",
        method: "GET",
        description: "Check if the address has been verified.",
        tags: ["identity-verification"],
        summary: "Check if the address has been verified.",
      },
    })
    .input(
      z.object({
        address: z.string(),
      }),
    )
    .output(z.any())
    .query(async ({ input }) => {
      console.log("validateAddress", input);
      const key = `${APP_NAME}:verify:${input.address.toLowerCase()}`;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const result = await redis.get(key) as unknown[]
      console.log(`found ${key}`, result);

      const scenarioId = env.NEXERA_SCENARIO_ID;

      console.log(
        `validateAddress Using scenarioId ${scenarioId} - ${
          result ? "gbg" : "sumsub"
        } for ${input.address}`,
      );

      // console.log("sending", credential);
      // return await apiClient.complianceApi.complianceExecute({
      //   complianceExecuteRequest: {
      //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //     // @ts-ignore
      //     inputData: {
      //       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //       // @ts-ignore
      //       credentials: [credential],
      //     },
      //     address: input.address,
      //     scenarioId: scenarioId,
      //   },
      // });

      console.log("EXECUTING QURRYYYY: ", input.address.toLowerCase(), result)
      const res = api.compliance.executeRule.useQuery({ address: input.address.toLowerCase(), credentials: result })

      console.log(":RESUUUUUULT: ", res)
      return true;
    }),
});
