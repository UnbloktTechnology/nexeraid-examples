import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useDefiRuleEngineKycAuthentication } from "./useDefiOffChainZKPKycAuthenticate";

export const useCheckDefiRuleEngineCompliance = (enabled: boolean) => {
  const { user } = useDefiRuleEngineKycAuthentication();
  const mutation = api.compliance.executeDefiRuleEngine.useMutation();

  return useQuery({
    queryKey: ["checkDefiRuleEngineCompliance", enabled],
    queryFn: async () => {
      if (!user)
        return Promise.resolve({
          data: "not_received",
          isValid: false,
        });
      const result = await mutation.mutateAsync({
        address: user,
      });
      return result;
    },
    enabled,
  });
};
