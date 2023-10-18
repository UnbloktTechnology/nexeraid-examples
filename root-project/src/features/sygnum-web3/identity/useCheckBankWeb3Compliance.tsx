import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useKycBankWeb3Authentication } from "@/features/sygnum-web3/identity/useKycBankWeb3Authenticate";

export const useCheckBankWeb3Compliance = (enabled: boolean) => {
  const { user } = useKycBankWeb3Authentication();
  const mutation = api.compliance.executeBankWeb3Engine.useMutation();

  return useQuery({
    queryKey: ["checkBankWeb3Compliance", enabled],
    queryFn: async () => {
      if (!user)
        return Promise.resolve({
          data: "not_received",
          isValid: false,
        });
      const result = await mutation.mutateAsync({
        address: user,
      });
      return result;
    },
    enabled,
  });
};
