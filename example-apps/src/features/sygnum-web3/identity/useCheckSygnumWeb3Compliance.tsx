import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useKycSygnumWeb3Authentication } from "@/features/sygnum-web3/identity/useKycSygnumWeb3Authentication";

export const useCheckSygnumWeb3Compliance = (enabled: boolean) => {
  const { user } = useKycSygnumWeb3Authentication();
  const mutation = api.compliance.executeBankWeb3Engine.useMutation();

  return useQuery({
    queryKey: ["checkSygnumWeb3Compliance", enabled],
    queryFn: async () => {
      if (!user)
        return Promise.resolve({
          data: "unknown",
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
