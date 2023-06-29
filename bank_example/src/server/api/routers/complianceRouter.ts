import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { env } from "@/env.mjs";
import { appConfig } from "@/appConfig";
import { redis } from "@/server/redis";
import { getDataWebhookRedisKey } from "@/pages/api/data-webhook";

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
      const redisKey = getDataWebhookRedisKey(input.address);
      const redisData = await redis.get(redisKey);
      console.log(`Got ${redisKey} from redis`, redisData);
      const body = {
        address: input.address,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        inputData: { credentials: redisData.data.credentials },
        scenarioId: env.NEXERA_SCENARIO_ID,
      };
      console.log("body", body);
      const result = await fetch(
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
          body: JSON.stringify(body),
        }
      );
      console.log(result);
      return result?.json();
    }),
});
