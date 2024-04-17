import { useQuery } from "@tanstack/react-query";
import { useDefiRuleEngineKycAuthentication } from "./useDefiOffChainZKPKycAuthenticate";
import { executeEngine } from "@/utils/executeEngine";

export const useCheckDefiRuleEngineCompliance = (enabled: boolean) => {
  const { user } = useDefiRuleEngineKycAuthentication();

  return useQuery({
    queryKey: ["checkDefiRuleEngineCompliance", enabled],
    queryFn: async () => {
      if (!user)
        return Promise.resolve({
          data: "unknown",
          isValid: false,
        });
      const result = await executeEngine(
        {
          address: user,
          blockchainNamespace: "eip-115",
        },
        "defi-rule-engine",
      );
      return result;
    },
    enabled,
  });
};
