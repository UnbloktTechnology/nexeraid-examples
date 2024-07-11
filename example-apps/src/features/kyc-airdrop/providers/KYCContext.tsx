// KYCContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  type ReactNode,
} from "react";
import { type Address } from "viem";
import { getUserIndex } from "../utils/getUserAllowance";

interface KYCContextProps {
  isWalletWhitelisted: boolean;
  isWalletAuthorized: boolean;
  checkIfWalletIsWhitelisted: (address: Address) => void;
  isWalletChecked: boolean;
  setIsWalletWhitelisted: (value: boolean) => void;
  setIsWalletAuthorized: (value: boolean) => void;
}

const KYCContext = createContext<KYCContextProps | undefined>(undefined);

export const KYCProvider = ({ children }: { children: ReactNode }) => {
  const [isWalletWhitelisted, setIsWalletWhitelisted] = useState(false);
  const [isWalletAuthorized, setIsWalletAuthorized] = useState(false);
  const [isWalletChecked, setIsWalletChecked] = useState(false);

  const checkIfWalletIsWhitelisted = (walletAddress: Address) => {
    const isWhitelisted = getUserIndex(walletAddress) !== -1;
    setIsWalletWhitelisted(isWhitelisted);
    setIsWalletChecked(true);
    console.log(`Wallet ${walletAddress} is whitelisted: ${isWhitelisted}`);
    return isWalletWhitelisted;
  };

  console.log(
    "isWalletWhitelisted",
    isWalletWhitelisted,
    "isWalletAuthorized",
    isWalletAuthorized,
    "isWalletChecked",
    isWalletChecked,
  );

  return (
    <KYCContext.Provider
      value={{
        isWalletWhitelisted,
        isWalletAuthorized,
        isWalletChecked,
        checkIfWalletIsWhitelisted,
        setIsWalletWhitelisted,
        setIsWalletAuthorized,
      }}
    >
      {children}
    </KYCContext.Provider>
  );
};

export const useKYCContext = () => {
  const context = useContext(KYCContext);
  if (!context) {
    throw new Error("useKYC must be used within a KYCProvider");
  }
  return context;
};
