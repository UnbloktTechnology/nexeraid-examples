import { useGlobalModals } from "@/features/Modals/useGlobalModals";

export const KycVerifyButton = () => {
  const { close } = useGlobalModals((state) => ({
    close: state.close,
    data: state.data,
  }));
  return (
    <button onClick={close} id="kyc-btn-verify">
      Verify
    </button>
  );
};
