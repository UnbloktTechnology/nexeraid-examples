/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { toast } from "react-toastify";
import { useContract, useSigner } from "wagmi";

import MockSwap from "./abis/MockSwap.json";

const CONTRACT_ADDRESS_MOCK_SWAP = "0xdAdb205B199dC8E679ACfD5B5Ed5cF35a3DA9067";
//const USDT = "0x12A54c8b4FF9a480088c387Bb4496A963323b672";

export const usePlaygroundMockSwap = () => {
  const mnftId = "1"; // Demo propose
  const { data: signer } = useSigner();
  // we can use typechain here to get typechain js objects
  const mockSwapContract = useContract({
    address: CONTRACT_ADDRESS_MOCK_SWAP,
    abi: MockSwap.abi,
    signerOrProvider: signer,
  });

  // console.log(mockSwapContract);

  const getConversionRate = async () => {
    try {
      if (!mockSwapContract) throw new Error("No MockSwap initialized");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
      const result = await mockSwapContract.conversionRate();

      console.log("RATE: ", Number(result));
    } catch (error) {
      console.log("Error: ", error);
    }
    return;
  };

  const swapNativeForUSDT = async (amount: string) => {
    try {
      if (!mockSwapContract) throw new Error("No MockSwap initialized");
      const overrides = {
        value: amount,
      };
      console.log("SWAP swapNativeForUSDT", amount);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
      const result = await mockSwapContract.swapNativeForUSDT(
        mnftId,
        overrides
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      console.log("SwapNative: ", await result.wait());
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Error swapping native for USDT");
    }
    return;
  };

  const swapUSDTForNative = async (amount: string) => {
    try {
      if (!mockSwapContract) throw new Error("No MockSwap initialized");
      console.log("SWAP swapUSDTForNative", amount);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
      const result = await mockSwapContract.swapUSDTForNative(amount, mnftId);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      console.log("SwapNative: ", await result.wait());
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Error swapping USDT for native");
    }
    return;
  };

  return {
    getConversionRate,
    swapUSDTForNative,
    swapNativeForUSDT,
  };
};
