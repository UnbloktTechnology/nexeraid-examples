import { useQuery } from "@tanstack/react-query";
import { useBankKYBAuthentication } from "@/features/bank-kyb/identity/useBankKYBAuthenticate";
import { executeEngine } from "@/utils/executeEngine";

export const useCheckBankKYBCompliance = (enabled: boolean) => {
  const { user } = useBankKYBAuthentication();

  return useQuery({
    queryKey: ["checkBankKYBCompliance", enabled],
    queryFn: async () => {
      if (!user)
        return Promise.resolve({
          data: "unknown",
          isValid: false,
        });
      const result = await executeEngine(
        {
          address: user.walletAddress,
          blockchainNamespace: "eip155",
        },
        "bank-kyb",
      );
      return result;
    },
    enabled,
  });
};
