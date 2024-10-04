import React, { useEffect } from "react";
import { AirdropLayout } from "@/ui/AirdropLayout";
import { useWalletAddress } from "@/lib/useWalletAddress";
import { getUserAirdropAmount } from "@/lib/airdropActions";
import { getAirdropTokenConfig } from "@/config/EXAMPLE_AIRDROP_CONTRACT_ADDRESSES";
import { AddTokenButton } from "@/ui/components/AddTokenButton";
import { formatAirdropTokenAmount } from "@/lib/formatDecimalNumber";
import { watchAccount } from "wagmi/actions";
import { wagmiConfig } from "@/wagmiConfig";
import {
  useRedirectToAccountPage,
  useRedirectToCheckWallet,
} from "@/lib/navigation";
import { useIsClaimed } from "@/lib/useIsClaimed";
import { Button } from "@/ui/components/Button";

export default function AllocationCheck() {
  const { address } = useWalletAddress();
  const isClaimed = useIsClaimed();
  const amount = getUserAirdropAmount(address);
  const { symbol } = getAirdropTokenConfig();
  const redirectToCheckWallet = useRedirectToCheckWallet();
  const redirectToAccountPage = useRedirectToAccountPage();
  const title = isClaimed?.isLoading
    ? "Claiming your tokens..."
    : "Tokens claimed successfully";

  const subtitle = isClaimed?.isLoading
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
        <Button variant="secondary" onClick={redirectToAccountPage}>
          Try another wallet
        </Button>
        <AddTokenButton variant="primary" />
      </div>
    </AirdropLayout>
  );
}
