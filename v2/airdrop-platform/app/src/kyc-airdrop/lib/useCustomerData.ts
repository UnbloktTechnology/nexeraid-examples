import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useWalletAddress } from "./useWalletAddress";
import { type SelectCustomer } from "@/db/customer.repo";
import {
  useNexeraIdConfig,
  watchWidgetVisibleState,
} from "@nexeraid/react-sdk";
import { useEffect } from "react";

export const useCustomerData = () => {
  const { address } = useWalletAddress();

  // on widget close, immediately invalidate the query
  // to prevent showing the previous user data
  const nexeraConfig = useNexeraIdConfig();
  const queryClient = useQueryClient();
  useEffect(() => {
    const unsubscribe = watchWidgetVisibleState(nexeraConfig, {
      onChange: (visible) => {
        if (!visible) {
          void queryClient.invalidateQueries();
        }
      },
    });
    return unsubscribe;
  }, [nexeraConfig]);

  return useQuery({
    queryKey: ["useCustomerData", address],
    enabled: !!address,
    refetchInterval: 5000,
    queryFn: async (): Promise<SelectCustomer | null> => {
      try {
        const res = await fetch(`/api/customer/${address}`);
        return res.json() as Promise<SelectCustomer | null>;
      } catch (error) {
        console.error("API call error:", error);
        return null;
      }
    },
  });
};
