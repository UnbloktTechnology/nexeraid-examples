import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useKycAuthentication } from "@/features/identity/useKycAuthenticate";

export const useCheckCompliance = (enabled: boolean) => {
  const { user } = useKycAuthentication();
  const mutation = api.compliance.executeRule.useMutation();

  return useQuery({
    queryKey: ["checkCompliance", enabled],
    queryFn: async () => {
      if (!user)
        return Promise.resolve({
          data: "not_received",
          isValid: false,
        });
      console.log("isCompliant", user);
      const result = await mutation.mutateAsync({
        address: user,
      });
      console.log("isCompliant result", result);
      return result;
    },
    enabled,
  });
};
