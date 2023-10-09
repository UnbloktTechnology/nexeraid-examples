import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { redis } from "@/server/redis";
import { getScenarioWebhookDefiRuleEngineRedisKey } from "@/pages/api/defi-rule-engine/scenario-webhook";
import { getScenarioWebhookDefiOffchainZKPRedisKey } from "../../../pages/api/defi-offchain-zkp/scenario-webhook";

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

type keyable = Record<string, unknown>;

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
  executeDefiOffchainZKP: publicProcedure
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
    const redisKey = getScenarioWebhookDefiOffchainZKPRedisKey(input.address);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
