/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useState } from "react";
import { TokenRow } from "./TokenRow";
import { type ITokenList } from "../../Interfaces";
import { BigNumber, ethers } from "ethers";
import { type Address } from "wagmi";

enum Tabs {
  Tokens,
  Nfts,
  Pools,
  Activity,
}

const amountToNumberFormat = (
  balance: BigNumber,
  decimals: number,
  fix: number
) => {
  return Number(ethers.utils.formatUnits(balance, decimals ?? 0)).toFixed(fix);
};

export const Portfolio = ({ tokens }: ITokenList) => {
  const [tabSelected, setTabSelected] = useState<Tabs>(Tabs.Tokens);

  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-y-hidden">
      <div className="flex space-x-4 font-bold">
        <span
          className={`cursor-pointer ${
            tabSelected === Tabs.Tokens ? "text-white" : "text-[#98A1C0]"
          }`}
          onClick={() => setTabSelected(Tabs.Tokens)}
        >
          Tokens
        </span>
        <span
          className={`cursor-pointer ${
            tabSelected === Tabs.Nfts ? "text-white" : "text-[#98A1C0]"
          }`}
          onClick={() => setTabSelected(Tabs.Nfts)}
        >
          NFTs
        </span>
        <span
          className={`cursor-pointer ${
            tabSelected === Tabs.Pools ? "text-white" : "text-[#98A1C0]"
          }`}
          onClick={() => setTabSelected(Tabs.Pools)}
        >
          Pools
        </span>
        <span
          className={`cursor-pointer ${
            tabSelected === Tabs.Activity ? "text-white" : "text-[#98A1C0]"
          }`}
          onClick={() => setTabSelected(Tabs.Activity)}
        >
          Activity
        </span>
      </div>

      <div className="flex h-auto flex-col gap-2 overflow-y-auto">
        {tabSelected === Tabs.Tokens &&
          tokens.map((token, index) => {
            const balance = token.balance
              ? amountToNumberFormat(
                  BigNumber.from(token.balance),
                  token.contract_decimals ?? 0,
                  3
                )
              : "0";

            return (
              <TokenRow
                key={index}
                tokenName={token.contract_name ?? ""}
                tokenSymbol={token.contract_ticker_symbol ?? ""}
                tokenLogo={token.logo_url ?? ""}
                tokenBalance={balance}
                currencySymbol="$"
                balanceInCurrency={balance}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                contractAddress={token.contract_address as Address}
                isToken
              />
            );
          })}
      </div>
    </div>
  );
};
