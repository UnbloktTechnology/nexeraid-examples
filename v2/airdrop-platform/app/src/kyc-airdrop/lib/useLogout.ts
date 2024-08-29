import { useCallback } from "react";
import { useRedirectToHome } from "./navigation";
import { useDisconnect } from "wagmi";

export const useLogout = () => {
  const redirectToHome = useRedirectToHome();
  const { disconnect } = useDisconnect();

  return useCallback(() => {
    disconnect();
    redirectToHome();
  }, [disconnect, redirectToHome]);
};
