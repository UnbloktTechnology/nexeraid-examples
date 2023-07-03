/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import { useAccountModal } from "@rainbow-me/rainbowkit";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { useAccount } from "wagmi";
import { type IWalletSidebar } from "../Interfaces";

export const WalletSidebar = ({ isOpen, onClose }: IWalletSidebar) => {
  const { openAccountModal } = useAccountModal();
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
                  seed={jsNumberForAddress(address as string)}
                />
                <span>{`${(address as string)?.slice(0, 5)}...${(
                  address as string
                )?.slice(37)}`}</span>
              </div>

              <div className="flex justify-end space-x-2">
                {/* <Icon
                  icon="config"
                  size={28}
                  className="cursor-pointer rounded-lg bg-[#293249] p-2"
                /> */}

                <span
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg bg-[#293249]"
                  onClick={openAccountModal}
                >
                  {/* <Icon icon="power" size={15} color="#98A1C0" /> */}
                  power
                </span>
              </div>
            </div>

            {/* <WalletBalanceWidget tokens={eoaTokenInfo} /> */}

            <div className="flex w-full flex-col justify-center gap-2">
              <button className="border-none !bg-[#1F2538]">
                View and sell NFTs
              </button>
              <button className="border-none !bg-[#1F2538]">
                <span className="flex items-center space-x-1">
                  {/* <Icon icon="buy" size={20} color="#98A1C0" className="!h-4" /> */}
                  <span>Buy crypto</span>
                </span>
              </button>
              <button className="border-none !bg-[#1F2538]">Review KYC</button>
            </div>

            {/* <Portfolio tokens={eoaTokenInfo} /> */}
          </div>
        </div>
      )}
    </>
  );
};
