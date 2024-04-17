import { useQuery } from "@tanstack/react-query";
import { useDefiOffchainZKPKycAuthentication } from "./useDefiOffChainZKPKycAuthenticate";
import { executeEngine } from "@/utils/executeEngine";

export const useCheckCompliance = (enabled: boolean) => {
  const { user } = useDefiOffchainZKPKycAuthentication();

  return useQuery({
    queryKey: ["checkDefiOffChainZKPCompliance", enabled],
    queryFn: async () => {
      if (!user)
        return Promise.resolve({
          data: "unknown",
          isValid: false,
        });
      console.log("isCompliant", user);

      const result = await executeEngine(
        {
          address: user,
          blockchainNamespace: "eip-115",
        },
        "defi-offchain-zkp",
      );
      console.log("isCompliant result", result);
      return result;
    },
    enabled,
  });
};
