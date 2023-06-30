import { type Address } from "wagmi";

interface TNftInfo {
  /**
   *
   * @type {number}
   * @memberof TokensGetTokens200ResponseItemsInner
   */
  contract_decimals?: number | null;
  /**
   *
   * @type {string}
   * @memberof TokensGetTokens200ResponseItemsInner
   */
  contract_name?: string | null;
  /**
   *
   * @type {string}
   * @memberof TokensGetTokens200ResponseItemsInner
   */
  contract_ticker_symbol?: string | null;
  /**
   *
   * @type {string}
   * @memberof TokensGetTokens200ResponseItemsInner
   */
  contract_address?: string | null;
  /**
   *
   * @type {Array<string>}
   * @memberof TokensGetTokens200ResponseItemsInner
   */
  supports_erc?: Array<string> | null;
  /**
   *
   * @type {string}
   * @memberof TokensGetTokens200ResponseItemsInner
   */
  logo_url?: string | null;
  /**
   *
   * @type {string}
   * @memberof TokensGetTokens200ResponseItemsInner
   */
  last_transferred_at?: string | null;
  /**
   *
   * @type {boolean}
   * @memberof TokensGetTokens200ResponseItemsInner
   */
  native_token?: boolean | null;
  /**
   *
   * @type {string}
   * @memberof TokensGetTokens200ResponseItemsInner
   */
  type?: string | null;
  /**
   *
   * @type {string}
   * @memberof TokensGetTokens200ResponseItemsInner
   */
  balance?: string | null;
  /**
   *
   * @type {string}
   * @memberof TokensGetTokens200ResponseItemsInner
   */
  balance_24h?: string | null;
  /**
   *
   * @type {number}
   * @memberof TokensGetTokens200ResponseItemsInner
   */
  quote_rate?: number | null;
  /**
   *
   * @type {number}
   * @memberof TokensGetTokens200ResponseItemsInner
   */
  quote_rate_24h?: number | null;
  /**
   *
   * @type {number}
   * @memberof TokensGetTokens200ResponseItemsInner
   */
  quote?: number | null;
  /**
   *
   * @type {number}
   * @memberof TokensGetTokens200ResponseItemsInner
   */
  quote_24h?: number | null;
  /**
   *
   * @type {Array<any>}
   * @memberof TokensGetTokens200ResponseItemsInner
   */
  nft_data?: Array<any> | null;
  /**
   *
   * @type {any}
   * @memberof TokensGetTokens200ResponseItemsInner
   */
  INFTMetadata?: any | null;
}

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
