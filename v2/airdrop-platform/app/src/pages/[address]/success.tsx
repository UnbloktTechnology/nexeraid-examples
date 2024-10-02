import React, { useEffect } from "react";
import { AirdropLayout } from "@/ui/AirdropLayout";
import { useGetTokenBalance } from "@/kyc-airdrop/lib/useGetTokenBalance";
import { useWalletAddress } from "@/kyc-airdrop/lib/useWalletAddress";
import { LogoutButton } from "@/ui/components/LogoutButton";
import { getUserAirdropAmount } from "@/kyc-airdrop/lib/airdropActions";
import { getAirdropTokenConfig } from "@/kyc-airdrop/config/EXAMPLE_AIRDROP_CONTRACT_ADDRESSES";
import { AddTokenButton } from "@/ui/components/AddTokenButton";
import { formatAirdropTokenAmount } from "@/kyc-airdrop/lib/formatDecimalNumber";
import { watchAccount } from "wagmi/actions";
import { wagmiConfig } from "@/wagmiConfig";
import { useRedirectToCheckWallet } from "@/kyc-airdrop/lib/navigation";

export default function AllocationCheck() {
  const { address } = useWalletAddress();
  const { isLoading: isBalanceLoading } = useGetTokenBalance();
  const amount = getUserAirdropAmount(address);
  const { symbol } = getAirdropTokenConfig();
  const redirectToCheckWallet = useRedirectToCheckWallet();
  const title = isBalanceLoading
    ? "Claiming your tokens..."
    : "Tokens claimed successfully";

  const subtitle = isBalanceLoading
    ? "Checking wallet balance..."
    : `Congrats! The allocated ${formatAirdropTokenAmount(amount)} $${symbol} were transferred to the wallet ${address}`;

  // redirect if we change wallet here
  useEffect(
    () =>
      watchAccount(wagmiConfig, {
        onChange: (account) => {
          if (
            account.address &&
            account.address?.toLocaleLowerCase() !==
              address?.toLocaleLowerCase()
          ) {
            redirectToCheckWallet(account.address);
          }
        },
      }),
    [redirectToCheckWallet, address],
  );

  return (
    <AirdropLayout titleOverwrite={title} subtitleOverwrite={subtitle}>
      <div className="flex justify-between gap-4">
        <LogoutButton variant="secondary" label="Try another wallet" />
        <AddTokenButton variant="primary" />
      </div>
    </AirdropLayout>
  );
}
