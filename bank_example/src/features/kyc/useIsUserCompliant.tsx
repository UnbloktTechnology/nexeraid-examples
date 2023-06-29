import { useContext } from "react";
import { SimpleAuthContext } from "@/features/SimpleAuthProvider";
import { api } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";

export const useIsUserCompliant = () => {
  const { getUser } = useContext(SimpleAuthContext);
  const isCompliant = api.compliance.executeRule.useMutation();

  return useMutation({
    mutationFn: async () => {
      const result = await isCompliant.mutateAsync({
        address: getUser()?.walletAddress ?? "",
      });
      return result.every((compliant) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return compliant.result.validate[0].is_valid as boolean;
      });
    },
  });
};
