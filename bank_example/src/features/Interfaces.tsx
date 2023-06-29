import type { ReactNode } from "react";
import { TestUser } from "@/appConfig";

export interface IDropDown {
  items: readonly TestUser[];
  selected?: TestUser;
  className?: string;
  classNameButton?: string;
  classNameList?: string;
  onSelect: (item: TestUser) => void;
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
