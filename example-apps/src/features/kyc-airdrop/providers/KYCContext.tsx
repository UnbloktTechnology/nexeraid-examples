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
  isWalletAuthorized: boolean; //TODO: Implement this after KYC completed
  checkIfWalletIsWhitelisted: (address: Address) => void;
  isWalletChecked: boolean;
  setIsWalletWhitelisted: (value: boolean) => void;
  setIsWalletAuthorized: (value: boolean) => void;
  isWalletFailedClaim: boolean;
  setIsWalletFailedClaim: (value: boolean) => void;
  resetKYCContext: () => void;
}

const defaultKYCValues = {
  isWalletWhitelisted: false,
  isWalletAuthorized: false,
  isWalletChecked: false,
  isWalletClaimed: false,
  isWalletFailedClaim: false,
};

const KYCContext = createContext<KYCContextProps | undefined>(undefined);

export const KYCProvider = ({ children }: { children: ReactNode }) => {
  const [isWalletWhitelisted, setIsWalletWhitelisted] = useState(
    defaultKYCValues.isWalletWhitelisted,
  );
  const [isWalletAuthorized, setIsWalletAuthorized] = useState(
    defaultKYCValues.isWalletAuthorized,
  );
  const [isWalletChecked, setIsWalletChecked] = useState(
    defaultKYCValues.isWalletChecked,
  );
  const [isWalletFailedClaim, setIsWalletFailedClaim] = useState(
    defaultKYCValues.isWalletFailedClaim,
  );

  const checkIfWalletIsWhitelisted = (walletAddress: Address) => {
    const isWhitelisted = getUserIndex(walletAddress) !== -1;
    setIsWalletWhitelisted(isWhitelisted);
    setIsWalletChecked(true);
    console.log(`Wallet ${walletAddress} is whitelisted: ${isWhitelisted}`);
    return isWalletWhitelisted;
  };

  const resetKYCContext = () => {
    setIsWalletWhitelisted(defaultKYCValues.isWalletWhitelisted);
    setIsWalletAuthorized(defaultKYCValues.isWalletAuthorized);
    setIsWalletChecked(defaultKYCValues.isWalletChecked);
    setIsWalletFailedClaim(defaultKYCValues.isWalletFailedClaim);
    console.log("KYC context has been reset");
  };

  return (
    <KYCContext.Provider
      value={{
        isWalletWhitelisted,
        isWalletAuthorized,
        isWalletChecked,
        checkIfWalletIsWhitelisted,
        setIsWalletWhitelisted,
        setIsWalletAuthorized,
        isWalletFailedClaim,
        setIsWalletFailedClaim,
        resetKYCContext,
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
