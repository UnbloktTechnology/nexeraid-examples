import { type ReactNode } from "react";

export type BackgroundType = "default" | "defi";

export interface ILayout {
  children: ReactNode;
  sidebar?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  bg?: BackgroundType;
}
