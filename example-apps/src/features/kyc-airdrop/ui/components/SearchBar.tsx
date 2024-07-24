import React, { useState } from "react";
import { Button } from "@/features/kyc-airdrop/ui/components/Button";
import { type Address } from "@nexeraid/identity-schemas";
import { useWalletCheck } from "@/features/kyc-airdrop/hooks/useWalletCheck"; // Adjust the path as needed

interface SearchBarProps {
  placeholder?: string;
}

export const SearchBar = ({ placeholder }: SearchBarProps) => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const { handleCheck, handleInvalidInput, isValidAddress } = useWalletCheck();

  const handlePasteAndCheck = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (isValidAddress(text)) {
        setWalletAddress(text);
        handleCheck(text as Address, setWalletAddress);
      } else {
        handleInvalidInput(setWalletAddress);
      }
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };

  const handleInputChange = (value: string) => {
    setWalletAddress(value);
    if (value.length >= 42) {
      // A valid address is 42 characters long, we don't want to check before that
      handleCheck(value as Address, setWalletAddress);
    }
  };

  return (
    <div className="flex w-full items-center rounded-xl bg-gray-100 p-2 shadow-md">
      <input
        type="text"
        placeholder={placeholder ?? "Enter wallet address here"}
        value={walletAddress}
        onChange={(e) => handleInputChange(e.target.value)}
        className="text-regular flex-grow bg-transparent px-4 py-2 text-black outline-none"
      />
      <Button
        variant="secondary"
        onClick={() => void handlePasteAndCheck()}
        className="flex items-center space-x-1 !bg-transparent text-blue-500 shadow-none hover:underline"
      >
        Paste & check
      </Button>
    </div>
  );
};
