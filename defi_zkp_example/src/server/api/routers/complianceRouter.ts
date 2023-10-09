import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { redis } from "@/server/redis";
import { getScenarioWebhookRedisKey } from "@/pages/api/scenario-webhook";

export const DATA_STATUS = z.enum(["received", "not_received"]);
interface keyable {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const complianceRouter = createTRPCRouter({
  executeRule: publicProcedure
    .input(
      z.object({
        address: z.string(),
      }),
    )
    .output(
      z.object({
        data: DATA_STATUS,
        isValid: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      const redisKey = getScenarioWebhookRedisKey(input.address);
      const redisData = await redis.get<keyable>(redisKey);

      console.log("REDIS DATA: ", redisData);

      if (Object.keys(redisData?.result as object).length > 0) {
        return {
          data: "received",
          isValid: true,
        };
      }
      return {
        data: "not_received",
        isValid: false,
      };
    }),
});
