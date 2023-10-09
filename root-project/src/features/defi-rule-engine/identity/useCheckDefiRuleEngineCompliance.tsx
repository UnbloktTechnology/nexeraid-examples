import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useKycAuthentication } from "@/features/useKycAuthenticate";

export const useCheckDefiRuleEngineCompliance = (enabled: boolean) => {
  const { user } = useKycAuthentication();
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
