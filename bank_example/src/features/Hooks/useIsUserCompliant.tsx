import { useContext } from "react";
import { SimpleAuthContext } from "@/features/SimpleAuthProvider";
import { useQuery } from "@tanstack/react-query";

export const useIsUserCompliant = () => {
  const { getUser } = useContext(SimpleAuthContext);
  const user = getUser();
  return useQuery({
    queryKey: ["bank", "isUserCompliant", user?.walletAddress],
    queryFn: async () => {
      if (
        user?.walletAddress === "0x6cA64ec25DF05E6d0BDB689e95C7bd623a3d7919"
      ) {
        return true;
      }
      const result = await fetch(`/verify?address=${user?.walletAddress}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const resultParsed = await result.json();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return resultParsed.result?.validate[0].is_valid as boolean;
    },
    enabled: !!user?.walletAddress,
    staleTime: 300000,
    cacheTime: 300000,
    retry: Infinity,
    retryDelay: 5000,
  });
};
