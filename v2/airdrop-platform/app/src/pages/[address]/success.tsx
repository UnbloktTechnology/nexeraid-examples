import React from "react";
import { AirdropLayout } from "@/kyc-airdrop/ui/AirdropLayout";
import { useGetTokenBalance } from "@/kyc-airdrop/lib/useGetTokenBalance";
import { useWalletAddress } from "@/kyc-airdrop/lib/useWalletAddress";
import { LogoutButton } from "@/kyc-airdrop/ui/components/LogoutButton";
import { getUserAirdropAmount } from "@/kyc-airdrop/lib/airdropActions";

export default function AllocationCheck() {
  const { address } = useWalletAddress();
  const { isLoading: isBalanceLoading } = useGetTokenBalance();
  const amount = getUserAirdropAmount(address);

  const title = isBalanceLoading
    ? "Claiming your tokens..."
    : "Tokens claimed successfully";

  const subtitle = isBalanceLoading
    ? "Checking wallet balance..."
    : `Congrats! The allocated ${amount.toString()} PEAQ were transferred to the wallet ${address}`;

  return (
    <AirdropLayout titleOverwrite={title} subtitleOverwrite={subtitle}>
      <LogoutButton variant="secondary" label="Try another wallet" />
    </AirdropLayout>
  );
}
