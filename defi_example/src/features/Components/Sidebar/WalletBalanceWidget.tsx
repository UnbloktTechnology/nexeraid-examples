import { useMemo } from "react";
import { type ITokenList } from "../../Interfaces";
import { ethers } from "ethers";

export const WalletBalanceWidget = ({ tokens }: ITokenList) => {
  const tokenBalance = useMemo(
    () =>
      tokens?.reduce((acc, cur) => {
        return (
          acc +
          Number(
            ethers.utils.formatUnits(
              cur.balance ?? "0",
              cur.contract_decimals ?? 0
            )
          )
        );
      }, 0) ?? 0,
    [tokens]
  );

  const { balance, decimals } = useMemo(
    () => formatTokenBalance(tokenBalance),
    [tokenBalance]
  );

  return (
    <div className="flex w-full flex-col justify-start gap-1">
      <div>
        Balance: {balance ?? "0"} ({decimals ?? "18"} decimals) $
      </div>

      <div className="flex items-center space-x-1">
        <div>down-balance</div>
        <span className="text-[#98A1C0]">
          {tokenBalance === 0 ? "$0.00 (0.0%)" : "$16.15 (0.62%)"}
        </span>
      </div>
    </div>
  );
};

function formatTokenBalance(tokenBalance: number) {
  // Format the tokenBalance using toLocaleString()
  const formattedBalance = tokenBalance.toLocaleString("en");

  // Split the formatted balance into two parts: before and after the decimal point
  const [integerPart, fractionalPart] = formattedBalance.split(".");

  // If the fractional part is undefined, it means tokenBalance is an integer
  const formattedDecimals =
    fractionalPart === undefined ? "00" : fractionalPart.slice(0, 4);

  return {
    balance: integerPart ?? "0",
    decimals: "." + formattedDecimals,
  };
}
