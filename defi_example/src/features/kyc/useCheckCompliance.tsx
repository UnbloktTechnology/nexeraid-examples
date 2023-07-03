import { api } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";

export const useCheckCompliance = () => {
  const { address } = useAccount();
  const mutation = api.compliance.executeRule.useMutation();

  const checkCompliance = useMutation({
    mutationFn: async () => {
      if (!address) return Promise.resolve(false);
      console.log("isCompliant", address);
      const result = await mutation.mutateAsync({
        address: address as string,
      });
      console.log("isCompliant result", result);
      return result.every((compliant) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return compliant.result.result.validate?.[0].is_valid as boolean;
      });
    },
  });

  return { checkCompliance };
};
