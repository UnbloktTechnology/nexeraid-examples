import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { redis } from "@/server/redis";
import { getScenarioWebhookRedisKey } from "../../../pages/api/scenario-webhook";

type IComplianceResult = {
  result: {
    isValid: boolean,
    reasons: string[]
  }
}
export interface IComplianceResponse {
  address: string
  scenarioResponses: IComplianceResult[][]
}

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
      const redisKey = getScenarioWebhookRedisKey(input.address);
      const redisData = await redis.get<IComplianceResponse>(redisKey);

      if (redisData) {
        const isNotValid = redisData.scenarioResponses.find((_curr) => _curr.find((curr) => !curr.result.isValid))

        return !isNotValid
      }
      
      return false
    }),
});
