import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import { useMemo } from "react";
import { useCustomerData } from "./useCustomerData";

export const useUsername = () => {
  const { data: customer } = useCustomerData();
  const customerId = customer?.id;

  const username = useMemo(() => {
    if (!customerId) return "";

    const nameFromSeed = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator: "-",
      seed: `customer-${customerId}`,
    });

    return nameFromSeed;
  }, [customerId]);

  return username;
};
