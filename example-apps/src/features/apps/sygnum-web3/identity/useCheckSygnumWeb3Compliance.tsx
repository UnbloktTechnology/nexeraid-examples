import { useQuery } from "@tanstack/react-query";
import { useKycSygnumWeb3Authentication } from "@/features/apps/sygnum-web3/identity/useKycSygnumWeb3Authentication";
import { executeEngine } from "@/utils/executeEngine";

export const useCheckSygnumWeb3Compliance = (enabled: boolean) => {
  const { user } = useKycSygnumWeb3Authentication();

  return useQuery({
    queryKey: ["checkSygnumWeb3Compliance", enabled],
    queryFn: async () => {
      if (!user)
        return Promise.resolve({
          data: "unknown",
          isValid: false,
        });

      const result = await executeEngine(
        {
          address: user,
          blockchainNamespace: "eip155",
        },
        "bank-web3",
      );
      return result;
    },
    enabled,
  });
};
