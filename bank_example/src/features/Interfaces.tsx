import type { ReactNode } from "react";

export interface IUser {
  id: string;
  avatar?: string;
  name: string;
  walletAddress: string;
  privateKey: string;
}

export interface IDropDown {
  items: readonly IUser[];
  selected?: IUser;
  className?: string;
  classNameButton?: string;
  classNameList?: string;
  onSelect: (item: IUser) => void;
}

export type BackgroundType = "default" | "defi";

export interface ILayout {
  children: ReactNode;
  sidebar?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  bg?: BackgroundType;
}
