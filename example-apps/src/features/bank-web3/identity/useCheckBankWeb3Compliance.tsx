import { useQuery } from "@tanstack/react-query";
import { useKycBankWeb3Authentication } from "@/features/bank-web3/identity/useKycBankWeb3Authenticate";
import { executeEngine } from "@/utils/executeEngine";

export const useCheckBankWeb3Compliance = (enabled: boolean) => {
  const { user } = useKycBankWeb3Authentication();

  return useQuery({
    queryKey: ["checkBankWeb3Compliance", enabled],
    queryFn: async () => {
      if (!user)
        return Promise.resolve({
          data: "unknown",
          isValid: false,
        });
      const result = await executeEngine(
        {
          address: user,
          blockchainNamespace: "eip115",
        },
        "bank-web3",
      );
      return result;
    },
    enabled,
  });
};
