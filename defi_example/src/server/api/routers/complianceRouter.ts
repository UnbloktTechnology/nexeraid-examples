import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { redis } from "@/server/redis";
import { getScenarioWebhookRedisKey } from "../../../pages/api/scenario-webhook";

type IComplianceResult = {
  result: {
    result: {
      is_valid: boolean,
      reasons: string[]
    }
  }
}
export interface IComplianceResponse {
  address: string
  scenarioResponses: IComplianceResult[][]
}

export const DATA_STATUS = z.enum(['received', 'not_received'])

export const complianceRouter = createTRPCRouter({
  executeRule: publicProcedure
    .input(
      z.object({
        address: z.string(),
      })
    )
    .output(
      z.object({
        data: DATA_STATUS,
        isValid: z.boolean()
      })
    )
    .mutation(async ({ input }) => {
      const redisKey = getScenarioWebhookRedisKey(input.address);
      const redisData = await redis.get<IComplianceResponse>(redisKey);

      console.log("REDIS DATA: ", JSON.stringify(redisData));

      if (redisData) {
        const isNotValid = redisData.scenarioResponses.find((_curr) => _curr.find((curr) => !curr.result.result.is_valid))

        return {
          data: 'received',
          isValid: !isNotValid
        }
      }
      
      return {
        data: 'not_received',
        isValid: false
      }
    }),
});
