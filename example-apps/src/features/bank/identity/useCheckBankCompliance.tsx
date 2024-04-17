import { useQuery } from "@tanstack/react-query";
import { useBankKycAuthentication } from "@/features/bank/identity/useBankKycAuthenticate";
import { executeEngine } from "@/utils/executeEngine";

export const useCheckBankCompliance = (enabled: boolean) => {
  const { user } = useBankKycAuthentication();

  return useQuery({
    queryKey: ["checkBankCompliance", enabled],
    queryFn: async () => {
      if (!user)
        return Promise.resolve({
          data: "unknown",
          isValid: false,
        });
      const result = await executeEngine(
        {
          address: user.walletAddress,
          blockchainNamespace: "eip-115",
        },
        "bank",
      );
      return result;
    },
    enabled,
  });
};
