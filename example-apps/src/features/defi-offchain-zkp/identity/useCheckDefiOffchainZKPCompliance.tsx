import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useDefiOffchainZKPKycAuthentication } from "./useDefiOffChainZKPKycAuthenticate";

export const useCheckCompliance = (enabled: boolean) => {
  const { user } = useDefiOffchainZKPKycAuthentication();
  const mutation = api.compliance.executeDefiOffchainZKP.useMutation();

  return useQuery({
    queryKey: ["checkDefiOffChainZKPCompliance", enabled],
    queryFn: async () => {
      if (!user)
        return Promise.resolve({
          data: "unknown",
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
