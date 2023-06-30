import React from "react";
import { type ITokenRow } from "../../Interfaces";

export const TokenRow = (props: ITokenRow) => {
  return (
    <div className="flex w-full cursor-pointer flex-row items-center justify-between p-4 pr-8">
      <div className="flex w-full flex-row items-center gap-2">
        <div>
          {props.tokenName}
          {props.tokenLogo}
        </div>
        <div className="flex flex-col">
          <div className="text-sm font-medium text-white">
            {props.tokenName}
          </div>
          <div className="text-fg-muted text-sm font-normal">
            {`${props.tokenBalance} ${props.tokenSymbol}`}
          </div>
        </div>
      </div>
      <div className="text-fg-muted flex space-x-1 text-sm font-normal">
        <span>{props.currencySymbol}</span>
        <span>{props.balanceInCurrency}</span>
      </div>
    </div>
  );
};
