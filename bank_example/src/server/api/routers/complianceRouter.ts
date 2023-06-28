import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { env } from "@/env.mjs";

const NEXERA_API_URLS = {
  local: "http://localhost:3001",
  dev: "https://api-dev.nexera.id",
  stage: "https://api-staging.nexera.id",
  prod: "https://api.nexera.id",
} as const;

export const complianceRouter = createTRPCRouter({
  executeRule: publicProcedure
    .input(
      z.object({
        address: z.string(),
        credentials: z.array(z.any()),
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
    .query(async ({ input }) => {
      const result = await fetch(
        `${
          NEXERA_API_URLS[env.NEXT_PUBLIC_ENVIRONMENT]
        }/compliance/scenario/execute`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.NEXT_PUBLIC_NEXERA_ID_API_KEY}`,
          },
          body: JSON.stringify({
            address: input.address,
            inputData: input.credentials,
            scenarioId: "string",
          }),
        }
      );
      return result.json();
    }),
});
