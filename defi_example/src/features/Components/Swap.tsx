import { useState } from "react";
import { useGlobalModals } from "@/features/Modals/Hooks/useGlobalModals";
import { useQueryClient } from "@tanstack/react-query";

import SwapOptionsData from "../SwapOptionsDemoData.json";
import { SwapInput } from "./SwapInput";
import { toast } from "react-toastify";
import { type ITokenInfo } from "@/features/Components/TokenDropDown";
import { Icon } from "./Icon";

const optionsToSwap = (options: ITokenInfo[], tokenInfo: ITokenInfo) => {
  return options.filter((token) => token.value !== tokenInfo.value);
};

export const Swap = () => {
  const options = SwapOptionsData as ITokenInfo[];
  const [fromAmount, setFromAmount] = useState("0");
  const [fromToken, setFromToken] = useState<ITokenInfo>(
    options[0] ?? {
      value: "select",
      label: "Select Token",
      pairs: [],
      address: "",
    }
  );
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
  };

  const getEstimateSwap = (
    value: string,
    token: ITokenInfo,
    isFrom: boolean
  ) => {
    const tokenInfo = isFrom ? toToken : fromToken;
    toast.info(`Getting estimate swap for ${tokenInfo.label}...`);
  };

  const handleFromValues = (value: string, token: ITokenInfo) => {
    setFromAmount(value);
    setFromToken(token);
    getEstimateSwap(value, token, true);
  };

  const handleToValues = (value: string, token: ITokenInfo) => {
    setToAmount(value);
    setToToken(token);
    getEstimateSwap(value, token, false);
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
          <div className="mx-2 flex justify-between mb-3">
            <span className="text-base font-bold text-white">Swap</span>
            <Icon icon="config" size={20} className="cursor-pointer" />
          </div>

          <div className="flex w-full flex-col items-center gap-4">
            <div className="flex flex-col justify-center items-center relative w-full gap-1">
              <SwapInput
                value={fromAmount}
                token={fromToken}
                options={optionsToSwap(options, toToken)}
                className="h-24 w-full rounded-xl bg-[#131A2A] text-white"
                classNameInput="text-4xl text-[#5D6785] w-[280px]"
                classNameDropDownButton="border-0 font-semibold text-xl bg-[#293249] rounded-2xl h-8"
                classNameDropDownList="font-semibold text-xl bg-[#293249] rounded-2xl"
                onChange={(value, token) => handleFromValues(value, token)}
              />
              <div className="absolute z-10 flex justify-center items-center cursor-pointer h-10 w-10 bg-[#293249] rounded-xl border-[#0D111C] border-4">
                <Icon
                  icon="arrow-down"
                  size={16}
                  onClick={() => handleSwapFrom()}
                  className="font-bold"
                />
              </div>
              <SwapInput
                value={toAmount}
                token={toToken}
                options={optionsToSwap(options, fromToken)}
                className="h-24 w-full rounded-xl bg-[#131A2A] text-white"
                classNameInput="text-4xl text-[#5D6785] w-[280px]"
                classNameDropDownButton="border-0 font-semibold text-xl bg-[#293249] rounded-2xl h-8"
                classNameDropDownList="font-semibold text-xl bg-[#293249] rounded-2xl"
                onChange={(value, token) => void handleToValues(value, token)}
              />
            </div>
          </div>
        </div>

        <button
          className="h-14 w-full mt-3 rounded-3xl bg-[#4c82fb3d] text-center text-xl font-bold text-[#4C82FB]"
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
