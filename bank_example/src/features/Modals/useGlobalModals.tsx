import { type ReactNode } from "react";
import { type BackgroundType } from "@/features/Layout";
import { type AvailableFlow } from "@nexeraid/kyc-sdk/client";
import { create } from "zustand";
import { type TestUser } from "@/appConfig";

export type CenterModalStyle = "default" | "rounded";

export interface ICenterModal {
  isOpen: boolean;
  children: ReactNode;
  style?: CenterModalStyle;
  overlay?: boolean;
  bg?: BackgroundType;
  onClose?: () => void;
}

export interface ModalStoreAttributes {
  title?: string;
  modalType?: "bottom" | "center" | "full" | "empty";
  overlayType?: "base" | "dark";
  style?: CenterModalStyle;
  bg?: BackgroundType;
  arrow?: boolean;
  onArrowClick?: () => void;
}

/**
 * Types
 */
interface ModalData {
  basicData?: {
    ctaButton?: ReactNode;
    text: string;
    title?: string;
    icon?: string;
    textButton?: string;
    onClick?: () => void;
  };
  userData?: {
    selected?: TestUser;
    users: TestUser[];
    onAuthenticate: (user: TestUser) => void;
    onSuccess?: (user: TestUser) => void;
  };
  initOnFlow?: AvailableFlow;
}

interface IModalStore {
  isOpen: boolean;
  view?: "KycModal" | "LogOnModal" | "AbnModal";
  attributes?: ModalStoreAttributes;
  data?: ModalData;
  open: (
    view: IModalStore["view"],
    attributes?: ModalStoreAttributes,
    data?: ModalData
  ) => void;
  close: () => void;
}

/**
 * Zustand Store
 */

export const useGlobalModals = create<IModalStore>((set) => ({
  isOpen: false,
  view: undefined,
  data: undefined,
  attributes: undefined,
  open: (
    view: IModalStore["view"],
    attributes: ModalStoreAttributes = {
      title: "GlobalModals",
      modalType: "center",
      overlayType: "base",
    },
    data?: ModalData
  ) => {
    set({
      isOpen: true,
      view,
      data,
      attributes,
    });
  },
  close: () => {
    set({
      isOpen: false,
      view: undefined,
      data: undefined,
      attributes: undefined,
    });
  },
}));
