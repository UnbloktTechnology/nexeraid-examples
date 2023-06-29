import { LogOnModal } from "@/features/Bank/Components/LogOnModal";
import { KycModal } from "@/features/Defi/KycModal";
import { CenterModal } from "@/features/Modals/CenterModal";
import { shallow } from "zustand/shallow";

import { LogInModal } from "../Abnamro/Components/LogInModal";
import { useGlobalModals } from "./Hooks/useGlobalModals";

export const GlobalModals = () => {
  const { view, isOpen, close, attributes } = useGlobalModals(
    (state) => ({
      view: state.view,
      isOpen: state.isOpen,
      close: state.close,
      attributes: state.attributes,
    }),
    shallow,
  );

  switch (attributes?.modalType) {
    case "center":
      return (
        <CenterModal
          isOpen={isOpen}
          onClose={close}
          style={attributes.style}
          bg={attributes.bg}
          overlay
        >
          {view === "KycModal" && <KycModal />}
          {view === "LogOnModal" && <LogOnModal />}
          {view === "AbnModal" && <LogInModal />}
        </CenterModal>
      );
    default:
      return <></>;
  }
};
