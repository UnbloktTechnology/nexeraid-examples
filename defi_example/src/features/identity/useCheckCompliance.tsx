import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useKycAuthentication } from "@/features/identity/useKycAuthenticate";

export const useCheckCompliance = (enabled: boolean) => {
  const { user } = useKycAuthentication();
  const mutation = api.compliance.executeRule.useMutation();

  const checkCompliance = useQuery({
    queryKey: ["checkCompliance", enabled],
    queryFn: async () => {
      if (!user) return Promise.resolve(false);
      console.log("isCompliant", user);
      const result = await mutation.mutateAsync({
        address: user,
      });
      console.log("isCompliant result", result);
      return result
        ? result.every((compliant) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            return compliant.result.result.validate?.[0].is_valid as boolean;
          })
        : false;
    },
    enabled,
  });

  return { checkCompliance };
};
