import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { env } from "@/env.mjs";
import { appConfig } from "../../../appConfig";

export const complianceRouter = createTRPCRouter({
  executeRule: publicProcedure
    .input(
      z.object({
        address: z.string(),
      })
    )
    .output(
      z.array(
        z.object({
          ruleId: z.string(),
          ruleName: z.string(),
          address: z.string(),
          result: z.any(),
          scenarioExecutionId: z.string(),
        })
      )
    )
    .mutation(async ({ input }) => {
      // TODO get creds from db based on address
      const creds = [];

      let result;

      try {
        result = await fetch(
          `${
            appConfig[env.NEXT_PUBLIC_ENVIRONMENT].api
          }/compliance/scenario/execute`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${env.NEXERA_ID_API_KEY}`,
            },
            body: JSON.stringify({
              address: input.address,
              inputData: { credentials: [] },
              scenarioId: env.NEXERA_SCENARIO_ID,
            }),
          }
        );
      } catch (e) {
        console.error(e);
      }
      return result?.json();
    }),
});
