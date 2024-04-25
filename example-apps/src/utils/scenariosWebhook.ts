import { RuleResultStatus } from "@nexeraprotocol/identity-schemas/identity";
import { GenericVerifiableCredentialSchema } from "@nexeraprotocol/identity-schemas/verifiable-credentials";
import { z } from "zod";

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
