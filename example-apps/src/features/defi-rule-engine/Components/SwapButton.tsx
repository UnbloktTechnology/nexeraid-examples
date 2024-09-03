import * as React from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useSimulateContract,
} from "wagmi";
import { parseEther, parseGwei } from "viem";
import { mockSwapABi } from "@/features/defi-rule-engine/Components/abi";
import { useDebounce } from "@/features/defi-rule-engine/useDebounce";

export const SwapButton = (props: { amount: string }) => {
  console.log("swap amount in matic: ", { amount: parseGwei(props.amount) });
  const debouncedTokenId = useDebounce(props.amount, 500);
  const { data } = useSimulateContract({
    address: "0xE352c14Dc08c280c8dA46D047D62FF29bc0e0F6a",
    abi: mockSwapABi,
    functionName: "swapNativeForUSDT",
    value: parseEther(props.amount),
  });
  const contractWrite = useWriteContract();

  const waitForTransaction = useWaitForTransactionReceipt({
    hash: contractWrite.data,
    confirmations: 3,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        contractWrite.writeContract?.(data!.request);
      }}
    >
      <button
        disabled={
          !contractWrite.writeContract ||
          waitForTransaction.isLoading ||
          !debouncedTokenId ||
          debouncedTokenId == "0"
        }
        className="mt-3 h-14 w-full rounded-3xl bg-[#4c82fb3d] text-center text-xl font-bold text-[#4C82FB]"
      >
        {contractWrite.isPending && "Confirm tx in MM"}
        {waitForTransaction.isLoading ? "Swapping..." : "Swap"}
      </button>
      {waitForTransaction.isSuccess && contractWrite.data && (
        <div>
          Successfully minted your NFT!
          <div>
            <a href={`https://etherscan.io/tx/${contractWrite.data}`}>
              Etherscan
            </a>
          </div>
        </div>
      )}
    </form>
  );
};
