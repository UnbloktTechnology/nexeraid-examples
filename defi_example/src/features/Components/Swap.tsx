import { useState } from "react";
import { useGlobalModals } from "@/features/Modals/Hooks/useGlobalModals";
import { useQueryClient } from "@tanstack/react-query";
import { ethers, type BigNumber } from "ethers";
import { useAccount } from "wagmi";

import { usePlaygroundMockSwap } from "../Contracts/Avalanche/PlaygroundMockSwap";
import { useTraderJoe } from "../Contracts/Avalanche/TraderJoe";
import { type ITokenInfo } from "../Interfaces";
import SwapOptionsData from "../SwapOptionsDemoData.json";
import { SwapInput } from "./SwapInput";

const amountToStringFormat = (
  balance: BigNumber | string,
  decimals: number,
  fix?: number
) => {
  const value = ethers.utils.formatUnits(balance, decimals ?? 0).toString();

  if (typeof fix === "undefined") return value;
  if (fix > decimals) return value;

  return value.slice(-(decimals - fix));
};

const stringToBtnFormat = (value: string, decimals: number) => {
  const decimalNumber = parseFloat(value);
  return ethers.utils.parseUnits(decimalNumber.toString(), decimals);
};

const optionsToSwap = (options: ITokenInfo[], tokenInfo: ITokenInfo) => {
  return options.filter((token) => token.value !== tokenInfo.value);
};

export const Swap = () => {
  const {
    WNATIVE,
    getSwapOut,
    // swapExactNATIVEForTokens,
    // swapExactTokensForNATIVE,
    // swapExactTokensForTokens,
  } = useTraderJoe();
  const { getConversionRate, swapUSDTForNative, swapNativeForUSDT } =
    usePlaygroundMockSwap();
  const options = SwapOptionsData as ITokenInfo[];
  const [swapError, setSwapError] = useState(true);
  const [fromAmount, setFromAmount] = useState("0");
  const [fromToken, setFromToken] = useState<ITokenInfo>(
    options[0] ?? {
      value: "select",
      label: "Select Token",
      pairs: [],
      address: "",
    }
  );
  const account = useAccount();
  const [toAmount, setToAmount] = useState("0");
  const [toToken, setToToken] = useState<ITokenInfo>({
    value: "select",
    label: "Select Token",
    address: "",
    pairs: [],
  });
  const { openModal, close } = useGlobalModals((state) => ({
    openModal: state.open,
    close: state.close,
  }));
  const queryClient = useQueryClient();

  const handleSwap = () => {
    // if (!isUserMockPMCompliant.data?.isVerified18) {
    openModal(
      "KycModal",
      {
        modalType: "center",
        overlayType: "dark",
      },
      {
        initOnFlow: "MANAGEMENT",
        basicData: {
          text: "Verify your identity on-chain to be able to swap assets on our Protocol",
          icon: "kyc",
          textButton: "Generate ZKProofs",
          onClick: () => {
            void queryClient.invalidateQueries();
            close();
          },
        },
      }
    );
    // } else {
    //   if (fromToken.address === WNATIVE) {
    //     await swapNativeForUSDT("10000000");
    //   } else {
    //     await swapUSDTForNative("10000000");
    //   }
    // }
  };

  const getEstimateSwap = async (
    value: string,
    token: ITokenInfo,
    isFrom: boolean
  ) => {
    const tokenInfo = isFrom ? toToken : fromToken;

    const tokenIndex = token.pairs.findIndex(
      (token) => token.value === tokenInfo.value
    );
    if (tokenIndex < 0) return;
    const pair = token.pairs[tokenIndex];
    let decimals = token.value === "avalanche" ? 18 : 6;
    const amount = stringToBtnFormat(value, decimals);
    const response = await getSwapOut(
      pair?.address as string,
      amount.toString(),
      pair?.swapForY as boolean
    );

    await getConversionRate();

    if (response.success) {
      setSwapError(false);
      decimals = pair?.value === "avalanche" ? 18 : 6;

      if (isFrom) {
        setToAmount(amountToStringFormat(response.amountOut, decimals));
      } else {
        setFromAmount(amountToStringFormat(response.amountOut, decimals));
      }
    } else {
      setSwapError(true);
    }
    console.log("RESPONSE", response);
  };

  const handleFromValues = (value: string, token: ITokenInfo) => {
    setFromAmount(value);
    setFromToken(token);
    void getEstimateSwap(value, token, true);
  };

  const handleToValues = (value: string, token: ITokenInfo) => {
    setToAmount(value);
    setToToken(token);
    void getEstimateSwap(value, token, false);
  };

  const handleSwapFrom = () => {
    const fromAmountCopy = fromAmount;
    const fromTokenCopy = fromToken;

    setFromAmount(toAmount);
    setToAmount(fromAmountCopy);
    setFromToken(toToken);
    setToToken(fromTokenCopy);
  };

  return (
    <div className="relative z-10 mx-auto mt-20 w-[464px]">
      <div className="flex w-full flex-col gap-1 rounded-xl bg-[#0D111C] p-4">
        <div className="flex flex-col">
          <div className="mx-2 flex justify-between">
            <span className="text-base font-bold text-white">Swap</span>
            {/* <Icon icon="config" size={20} className="cursor-pointer" /> */}
          </div>

          <div className="flex w-full flex-col items-center gap-4">
            <div className="relative w-full">
              <SwapInput
                value={fromAmount}
                token={fromToken}
                options={optionsToSwap(options, toToken)}
                className="my-4 h-24 w-full rounded-xl bg-[#131A2A] text-white"
                classNameInput="text-4xl text-[#5D6785] w-[280px]"
                classNameDropDownButton="border-0 font-semibold text-xl bg-[#293249] rounded-2xl h-8"
                classNameDropDownList="font-semibold text-xl bg-[#293249] rounded-2xl"
                onChange={(value, token) => void handleFromValues(value, token)}
              />

              <div
                className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-xl border-4 border-[#0D111C] bg-[#293249] p-2"
                onClick={() => handleSwapFrom()}
              >
                arrow-down
              </div>

              <SwapInput
                value={toAmount}
                token={toToken}
                options={optionsToSwap(options, fromToken)}
                className="my-4 h-24 w-full rounded-xl bg-[#131A2A] text-white"
                classNameInput="text-4xl text-[#5D6785] w-[280px]"
                classNameDropDownButton="border-0 font-semibold text-xl bg-[#293249] rounded-2xl h-8"
                classNameDropDownList="font-semibold text-xl bg-[#293249] rounded-2xl"
                onChange={(value, token) => void handleToValues(value, token)}
              />
            </div>
          </div>

          {swapError && (
            <p className="text-negative-default text-[12px] leading-4 text-[#]">
              Insufficient liquidity
            </p>
          )}
        </div>

        <button
          className="h-14 w-full rounded-3xl bg-[#4c82fb3d] text-center text-xl font-bold text-[#4C82FB]"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={handleSwap}
        >
          {/* {isUserMockPMCompliant.data?.isVerified18
            ? "Swap" */}
          Verify identity on-chain
        </button>
      </div>
    </div>
  );
};
