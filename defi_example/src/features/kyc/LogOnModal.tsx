import { KycVerifyButton } from "@/features/kyc/KycVerifyButton";
import { useKycAuthentication } from "@/features/kyc/useKycAuthenticate";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";

export const LogOnModal = () => {
  const account = useAccount();
  const { authenticate, isAuthenticated } = useKycAuthentication();

  return (
    <div className="flex w-full flex-col items-center gap-10">
      <div className="flex w-full flex-col gap-4">
        <h3 className="text-2xl text-white">Verify your identity to be able to swap</h3>
      </div>

      <div className="flex w-full flex-col items-center">
        <ConnectButton />
      </div>

      {account.address && !isAuthenticated && (
        <button
          className={`ml-auto rounded-md bg-[blue] px-6 py-4 text-base font-bold text-white`}
          onClick={() => {
            if (!account.address) {
              toast("Please connect your wallet first");
              return;
            }
            authenticate.mutate({ user: account.address });
          }}
        >
          Log in
        </button>
      )}
      {account.address && isAuthenticated && <KycVerifyButton />}
    </div>
  );
};
