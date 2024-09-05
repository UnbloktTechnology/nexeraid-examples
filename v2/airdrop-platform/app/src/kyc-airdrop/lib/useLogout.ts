import { useCallback } from "react";
import { useRedirectToHome } from "./navigation";
import { useDisconnect as useWagmiDisconnect } from "wagmi";
import { useDisconnect as useNexeraDisconnect } from "@nexeraid/react-sdk";

export const useLogout = () => {
  const redirectToHome = useRedirectToHome();
  const { disconnect: disconnectWagmi } = useWagmiDisconnect();
  const disconnectNexera = useNexeraDisconnect();

  return useCallback(() => {
    disconnectWagmi();
    void disconnectNexera.mutateAsync();
    redirectToHome();
  }, [disconnectWagmi, redirectToHome, disconnectNexera]);
};
