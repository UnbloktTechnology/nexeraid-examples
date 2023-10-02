import * as React from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { parseEther, parseGwei } from "viem";
import { mockSwapABi } from "@/features/Components/abi";
import { useDebounce } from "@/features/useDebounce";

export const SwapButton = (props: { amount: string }) => {
  console.log("swap amount in matic: ", { amount: parseGwei(props.amount) });
  const debouncedTokenId = useDebounce(props.amount, 500);
  const { config } = usePrepareContractWrite({
    address: "0x10e26aE45a98CCA6bed4Ee58Ba6F5649Ab9FDA08",
    abi: mockSwapABi,
    functionName: "swapNativeForUSDT",
    enabled: !!debouncedTokenId && debouncedTokenId !== "0",
    value: parseEther(props.amount),
  });
  const contractWrite = useContractWrite(config);

  const waitForTransaction = useWaitForTransaction({
    hash: contractWrite.data?.hash,
    confirmations: 3,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        contractWrite.write?.();
      }}
    >
      <button
        disabled={!contractWrite.write || waitForTransaction.isLoading}
        className="mt-3 h-14 w-full rounded-3xl bg-[#4c82fb3d] text-center text-xl font-bold text-[#4C82FB]"
      >
        {contractWrite.isLoading && "Confirm tx in MM"}
        {waitForTransaction.isLoading ? "Swapping..." : "Swap"}
      </button>
      {waitForTransaction.isSuccess && contractWrite.data?.hash && (
        <div>
          Successfully minted your NFT!
          <div>
            <a href={`https://etherscan.io/tx/${contractWrite.data?.hash}`}>
              Etherscan
            </a>
          </div>
        </div>
      )}
    </form>
  );
};
