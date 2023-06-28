import { useContext } from "react";
import { SimpleAuthContext } from "@/features/SimpleAuthProvider";
import { api } from "@/utils/api";

export const useIsUserCompliant = () => {
  const { getUser } = useContext(SimpleAuthContext);
  const isCompliant = api.compliance.executeRule.useQuery(
    {
      address: getUser()?.walletAddress ?? "",
    },
    {
      enabled: !!getUser()?.walletAddress,
    }
  );
  const isCompliantValue = isCompliant.data?.every((compliant) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return compliant.result.validate[0].is_valid as boolean;
  });
  return {
    ...isCompliant,
    data: isCompliantValue,
  };
};
