import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useBankKycAuthentication } from "@/features/bank/identity/useBankKycAuthenticate";

export const useCheckBankCompliance = (enabled: boolean) => {
  const { user } = useBankKycAuthentication();
  const mutation = api.compliance.executeBankEngine.useMutation();

  return useQuery({
    queryKey: ["checkBankCompliance", enabled],
    queryFn: async () => {
      if (!user)
        return Promise.resolve({
          data: "unknown",
          isValid: false,
        });
      const result = await mutation.mutateAsync({
        address: user.walletAddress,
      });
      return result;
    },
    enabled,
  });
};
