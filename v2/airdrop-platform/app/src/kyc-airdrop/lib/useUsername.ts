import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import { useWalletAddress } from "./useWalletAddress";
import { useMemo } from "react";

export const useUsername = () => {
  const { address } = useWalletAddress();

  const username = useMemo(() => {
    if (!address) return "";

    const nameFromSeed = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator: "-",
      seed: address.toLocaleLowerCase(),
    });

    return nameFromSeed;
  }, [address]);

  return username;
};
