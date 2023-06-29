import { type TNftInfo } from "@nexeraprotocol/react/api";
import { type Address } from "wagmi";

export type IWalletSidebar = {
  isOpen: boolean;
  onClose: () => void;
};

export interface ITokenInfo {
  value: string | number;
  label: string;
  address: string;
  pairs: ITokensPair[];
  icon?: string;
  decimals?: number;
}

export interface ITokensPair {
  value: string;
  address: string;
  swapForY: boolean;
}

export interface TInput {
  options: readonly ITokenInfo[];
  value: string;
  token: ITokenInfo;
  className?: string;
  classNameInput?: string;
  classNameDropDownButton?: string;
  classNameDropDownList?: string;
  onChange: (value: string, token: ITokenInfo) => void;
}

export interface IDropDown {
  items: readonly ITokenInfo[];
  selected?: ITokenInfo;
  className?: string;
  classNameButton?: string;
  classNameList?: string;
  onSelect: (item: ITokenInfo) => void;
}

export interface ITokenList {
  tokens: TNftInfo[];
}

export interface ITokenRow {
  key?: number | string;
  tokenLogo?: string;
  tokenName: string;
  tokenSymbol: string;
  tokenBalance: string;
  currencySymbol: string;
  balanceInCurrency: string;
  contractAddress?: Address;
  isToken?: boolean;
}

export interface ISwapOut {
  amountInLeft: string;
  amountOut: string;
  fee: string;
  success: boolean;
}