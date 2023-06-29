import { api } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { useKycAuthentication } from "@/features/kyc/useKycAuthenticate";

export const useIsUserCompliant = () => {
  const { user } = useKycAuthentication();
  const isCompliant = api.compliance.executeRule.useMutation();

  return useMutation({
    mutationFn: async () => {
      if (!user) return Promise.resolve(false);
      const result = await isCompliant.mutateAsync({
        address: user.walletAddress,
      });
      return result.every((compliant) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return compliant.result.validate[0].is_valid as boolean;
      });
    },
  });
};
