import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { redis } from "@/server/redis";
import { getScenarioWebhookDefiRuleEngineRedisKey } from "@/pages/api/defi-rule-engine/scenario-webhook";
import { getScenarioWebhookDefiOffchainZKPRedisKey } from "@/pages/api/defi-offchain-zkp/scenario-webhook";
import { getScenarioWebhookBankRedisKey } from "@/pages/api/bank/scenario-webhook";
import { getScenarioWebhookBankWeb3RedisKey } from "@/pages/api/bank-web3/scenario-webhook";
import {
  GenericVerifiableCredentialSchema,
  RuleResultStatus,
} from "@nexeraprotocol/nexera-id-schemas";

export const ScenarioWebhookPayloadSchema = z.object({
  customerId: z.string(),
  address: z.string(),
  result: RuleResultStatus,
  executionId: z.string(),
  scenarios: z
    .object({
      scenarioId: z.string(),
      result: z
        .object({
          objectId: z.string(),
          result: z.object({
            is_valid: z.boolean(),
            reasons: z.array(z.unknown()),
          }),
        })
        .array(),
    })
    .array(),
  data: GenericVerifiableCredentialSchema.array(),
});
export type ScenarioWebhookPayload = z.infer<
  typeof ScenarioWebhookPayloadSchema
>;

export const ScenariosWebhookResponse = z.object({
  data: RuleResultStatus,
  isValid: z.boolean(),
});
export type ScenariosWebhookResponse = z.infer<typeof ScenariosWebhookResponse>;

export const complianceRouter = createTRPCRouter({
  executeDefiRuleEngine: publicProcedure
    .input(
      z.object({
        address: z.string(),
      }),
    )
    .output(ScenariosWebhookResponse)
    .mutation(async ({ input }) => {
      const redisKey = getScenarioWebhookDefiRuleEngineRedisKey(input.address);
      const redisData = await redis.get<ScenarioWebhookPayload>(redisKey);

      console.log("REDIS DATA DEFI RULE ENGINE: ", JSON.stringify(redisData));
      if (redisData?.result) {
        await redis.del(redisKey);

        return {
          data: redisData.result,
          isValid: redisData?.result === "valid",
        };
      }

      return {
        data: "unknown",
        isValid: false,
      };
    }),
  executeDefiOffchainZKP: publicProcedure
    .input(
      z.object({
        address: z.string(),
      }),
    )
    .output(ScenariosWebhookResponse)
    .mutation(async ({ input }) => {
      const redisKey = getScenarioWebhookDefiOffchainZKPRedisKey(input.address);
      const redisData = await redis.get<ScenarioWebhookPayload>(redisKey);

      console.log("REDIS DATA DEFI OFFCHAIN ZKP: ", redisData);
      if (redisData?.result) {
        await redis.del(redisKey);

        return {
          data: redisData.result,
          isValid: redisData.result === "valid",
        };
      }
      return {
        data: "unknown",
        isValid: false,
      };
    }),
  executeBankEngine: publicProcedure
    .input(
      z.object({
        address: z.string(),
      }),
    )
    .output(ScenariosWebhookResponse)
    .mutation(async ({ input }) => {
      const redisKey = getScenarioWebhookBankRedisKey(input.address);
      const redisData = await redis.get<ScenarioWebhookPayload>(redisKey);

      console.log("REDIS DATA BANK: ", JSON.stringify(redisData));
      if (redisData?.result) {
        await redis.del(redisKey);

        return {
          data: redisData.result,
          isValid: redisData.result === "valid",
        };
      }

      return {
        data: "unknown",
        isValid: false,
      };
    }),
  executeBankWeb3Engine: publicProcedure
    .input(
      z.object({
        address: z.string(),
      }),
    )
    .output(ScenariosWebhookResponse)
    .mutation(async ({ input }) => {
      const redisKey = getScenarioWebhookBankWeb3RedisKey(input.address);
      const redisData = await redis.get<ScenarioWebhookPayload>(redisKey);

      console.log("REDIS DATA BANK WEB3: ", JSON.stringify(redisData));
      if (redisData?.result) {
        await redis.del(redisKey);

        return {
          data: redisData.result,
          isValid: redisData.result === "valid",
        };
      }

      return {
        data: "unknown",
        isValid: false,
      };
    }),
});
