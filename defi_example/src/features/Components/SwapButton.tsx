import * as React from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { mockSwapABi } from "@/features/Components/abi";
import { useDebounce } from "@/features/useDebounce";

export const SwapButton = (props: { amount: bigint }) => {
  const debouncedTokenId = useDebounce(props.amount, 500);
  const { config } = usePrepareContractWrite({
    address: "0x8C85697F41330c9bb3a197a91E4E85D627F03bCe",
    abi: mockSwapABi,
    functionName: "swapNativeForUSDT",
    args: [BigInt(0)],
    enabled: !!debouncedTokenId,
    value: BigInt(props.amount),
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
