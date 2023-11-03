import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { useAccount } from "wagmi";
import { Icon } from "../Components/Icon";

export type IWalletSidebar = {
  isOpen: boolean;
  onClose: () => void;
};

export const WalletSidebar = ({ isOpen, onClose }: IWalletSidebar) => {
  const { address } = useAccount();

  return (
    <>
      {isOpen && (
        <div className="fixed z-50 flex h-full w-full">
          <div
            className="fixed h-full w-full cursor-pointer bg-transparent"
            onClick={onClose}
          />
          <div className="animate-open-wallet-sidebar z-30 m-4 ml-auto flex h-[96%] w-full max-w-sm flex-col items-center gap-6 rounded-xl bg-[#0C0E15] px-4 py-6 text-white">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center space-x-2">
                <Jazzicon
                  diameter={35}
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
                  seed={jsNumberForAddress(address as string)}
                />
                <span>{`${(address as string)?.slice(0, 5)}...${(
                  address as string
                )?.slice(37)}`}</span>
              </div>

              <div className="flex justify-end space-x-2">
                <Icon
                  icon="config"
                  size={28}
                  className="cursor-pointer rounded-lg bg-[#293249] p-2"
                />

                <Icon
                  icon="power"
                  size={28}
                  className="cursor-pointer rounded-lg bg-[#293249] p-2 text-white"
                />
              </div>
            </div>

            <div className="flex w-full flex-col justify-center gap-2">
              <button className="rounded-xl border-none !bg-[#1F2538] p-4">
                View and sell NFTs
              </button>
              <button className="rounded-xl border-none !bg-[#1F2538] p-4">
                <span className="flex items-center justify-center gap-2 space-x-1">
                  <Icon icon="buy" className="text-white" />
                  <span>Buy crypto</span>
                </span>
              </button>
              <button className="rounded-xl border-none !bg-[#1F2538] p-4">
                Review KYC
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
