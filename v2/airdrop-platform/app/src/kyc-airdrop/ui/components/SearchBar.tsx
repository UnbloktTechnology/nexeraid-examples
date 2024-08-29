import React, { useState } from "react";
import { Button } from "@/kyc-airdrop/ui/components/Button";
import { useRedirectToCheckWallet } from "@/kyc-airdrop/lib/navigation";
import { isAddress } from "viem";
interface SearchBarProps {
  placeholder?: string;
}

export const SearchBar = ({ placeholder }: SearchBarProps) => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const redirectToCheckWallet = useRedirectToCheckWallet();

  const handlePasteAndCheck = async () => {
    let text: string | null = null;
    try {
      text = await navigator.clipboard.readText();
    } catch (err) {
      setError("Error reading clipboard");
    }

    if (text === null) {
      setError("Error reading clipboard");
      return;
    }

    if (isAddress(text)) {
      setWalletAddress(text);
      setError(null);

      redirectToCheckWallet(text);
    } else {
      setError("Invalid address");
    }
  };

  const handleInputChange = (value: string) => {
    setWalletAddress(value);
    setError(null);
    if (isAddress(value)) {
      redirectToCheckWallet(value);
    } else if (value.length >= 42) {
      setError("Invalid address");
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
      {error && <span className="text-sm text-red-500">{error}</span>}
      <Button
        variant="secondary"
        disabled={error !== null}
        onClick={() => void handlePasteAndCheck()}
        className="flex items-center space-x-1 !bg-transparent text-blue-500 shadow-none hover:underline"
      >
        Paste & check
      </Button>
    </div>
  );
};
