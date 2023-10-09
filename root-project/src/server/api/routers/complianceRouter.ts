import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { redis } from "@/server/redis";
import { getScenarioWebhookDefiRuleEngineRedisKey } from "../../../pages/api/defi-rule-engine/scenario-webhook";

type IDefiRuleEngineComplianceResult = {
  result: {
    result: {
      is_valid: boolean,
      reasons: string[]
    }
  }
}
export interface IDefiRuleEngineComplianceResponse {
  address: string
  scenarioResponses: IDefiRuleEngineComplianceResult[][]
}

export const DATA_STATUS = z.enum(['received', 'not_received'])

export const complianceRouter = createTRPCRouter({
  executeDefiRuleEngine: publicProcedure
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
      const redisKey = getScenarioWebhookDefiRuleEngineRedisKey(input.address);
      const redisData = await redis.get<IDefiRuleEngineComplianceResponse>(redisKey);

      console.log("REDIS DATA: ", JSON.stringify(redisData));

      if (redisData?.scenarioResponses) {
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
