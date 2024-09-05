import { useOpenWidget } from "@nexeraid/react-sdk";
import { Button } from "../Components/Button";

export const IdentityVerifyButton = () => {
  const openWidget = useOpenWidget();

  return (
    <Button
      id="identity-btn-verify"
      className={"ml-auto px-6 py-4 text-base font-bold text-white"}
      onClick={() => openWidget.mutateAsync()}
      disabled={openWidget.isLoading}
    >
      {openWidget.isLoading ? "..." : "Verify"}
    </Button>
  );
};
