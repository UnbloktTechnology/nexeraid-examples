import type { Address } from "@nexeraid/identity-schemas";
import userAllowances from "./merkle-tree/complex_example.json";

export const getUserAllowance = (userAddress: Address) => {
  return (userAllowances as Record<Address, number>)[userAddress];
};

export const getUserIndex = (userAddress: Address) => {
  return Object.keys(userAllowances).indexOf(userAddress);
};
