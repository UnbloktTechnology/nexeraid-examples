import { useQuery } from "@tanstack/react-query";
import { useWalletAddress } from "./useWalletAddress";
import { type SelectCustomer } from "@/db/customer.repo";

export const getCustomerDataQueryKey = ({
  address,
}: {
  address: string | undefined;
}) => ["useCustomerData", address];

export const useCustomerData = () => {
  const { address } = useWalletAddress();

  return useQuery({
    queryKey: getCustomerDataQueryKey({ address }),
    enabled: !!address,
    refetchInterval: 5000,
    queryFn: async (): Promise<SelectCustomer | null> => {
      try {
        const res = await fetch(`/api/customer/${address}`);
        const resObj = (await res.json()) as {
          customer?: SelectCustomer | null;
        };

        return resObj.customer ?? null;
      } catch (error) {
        console.error("API call error:", error);
        return null;
      }
    },
  });
};
