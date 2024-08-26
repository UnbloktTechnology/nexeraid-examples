
import { useQuery } from "@tanstack/react-query";
import type { Address } from "viem";
export interface CustomerStatusResponse {
  status: string;
}

export const useGetCustomerStatusByProjectIdAndWallet = (
  address: Address,
  isCustomerStatusActive?: boolean,
) => {
  return useQuery({
    queryKey: ["useCustomerStatusByProjectIdAndWallet"],
    enabled: !isCustomerStatusActive,
    refetchInterval: 5000, // 5 seconds
    queryFn: async () => {
      try {
        const response = await fetch(`/api/kyc-airdrop/get-customer-status`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch customer status");
        }

        const data = (await response.json()) as CustomerStatusResponse;
        console.log("Customer status:", data);
        return data;
      } catch (error) {
        console.error("Error fetching customer status:", error);
        throw new Error("Error fetching customer");
      }
    },
  });
};
