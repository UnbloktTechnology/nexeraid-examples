import type { Address } from "@nexeraid/identity-schemas";
import { userAllowances } from "./merkle-tree/complex_example";

export const getUserAllowance = (userAddress: Address) => {
  const balance = (userAllowances.balances).find(
    (balance) => balance.address === userAddress
  );
  return balance ? parseInt(balance.earnings, 10) : undefined;
};

export const getUserIndex = (userAddress: Address) => {
  return (userAllowances.balances.findIndex(
    (balance) => balance.address === userAddress
  ));
};
