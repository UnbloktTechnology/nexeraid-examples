export interface IUser {
  id: string;
  avatar?: string;
  name: string;
  walletAddress: string;
  privateKey: string;
}

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
