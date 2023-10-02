import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useKycAuthentication } from "@/features/identity/useKycAuthenticate";

export const useCheckCompliance = (enabled: boolean) => {
  const { user } = useKycAuthentication();
  const mutation = api.compliance.executeRule.useMutation();

  return useQuery({
    queryKey: ["checkCompliance", enabled],
    queryFn: async () => {
      if (!user) return Promise.resolve(false);
      const result = await mutation.mutateAsync({
        address: user,
      });
      return result;
    },
    enabled,
  });
};
