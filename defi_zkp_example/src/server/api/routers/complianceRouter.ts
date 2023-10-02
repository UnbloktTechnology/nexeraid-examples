import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { env } from "@/env.mjs";
import { appConfig } from "@/appConfig";
import { redis } from "@/server/redis";
import { getScenarioWebhookRedisKey } from "@/pages/api/scenario-webhook";


export const complianceRouter = createTRPCRouter({
  executeRule: publicProcedure
    .input(
      z.object({
        address: z.string(),
      })
    )
    .output(
      z.any()
    )
    .mutation(async ({ input }) => {

      console.log('getScenarioWebhookRedisKey')
      const redisKey = getScenarioWebhookRedisKey(input.address);
      const redisData = await redis.get(redisKey);

      console.log("REDIS DATA: ", redisData)
      return redisData
    }),
});

