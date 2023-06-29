import React, { useMemo, useState } from "react";
import { useAccountModal } from "@rainbow-me/rainbowkit";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { useAccount, useNetwork } from "wagmi";

import { ChainIdSchema } from "@nexeraprotocol/nexera-id-schemas";
import { Button, Icon } from "@nexeraprotocol/react-components";
import { useEOATokenInfo, type TNftInfo } from "@nexeraprotocol/react/api";

import { Portfolio } from "../Components/Sidebar/Portfolio";
import { WalletBalanceWidget } from "../Components/Sidebar/WalletBalanceWidget";
import { type IWalletSidebar } from "../Interfaces";

export const WalletSidebar = ({ isOpen, onClose }: IWalletSidebar) => {
  const { openAccountModal } = useAccountModal();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const tokensInfo = useEOATokenInfo({
    chainId: ChainIdSchema.parse(chain?.id) ?? undefined,
    userAddress: address,
  });
  const [eoaTokenInfo, setEoaTokenInfo] = useState<Array<TNftInfo>>([]);
  console.log("TOkens", tokensInfo);

  useMemo(() => {
    if (typeof tokensInfo?.eoaTokenInfo.data?.items === "undefined") return;

    const tokens = tokensInfo.eoaTokenInfo.data.items.filter(
      (token: TNftInfo) => {
        return (
          typeof token !== "undefined" &&
          typeof token.contract_ticker_symbol !== "undefined"
        );
      },
    );
    setEoaTokenInfo(tokens);
  }, [tokensInfo?.eoaTokenInfo.data?.items]);

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
                <span>{`${address?.slice(0, 5)}...${address?.slice(37)}`}</span>
              </div>

              <div className="flex justify-end space-x-2">
                <Icon
                  icon="config"
                  size={28}
                  className="cursor-pointer rounded-lg bg-[#293249] p-2"
                />

                <span
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg bg-[#293249]"
                  onClick={openAccountModal}
                >
                  <Icon icon="power" size={15} color="#98A1C0" />
                </span>
              </div>
            </div>

            <WalletBalanceWidget tokens={eoaTokenInfo} />

            <div className="flex w-full flex-col justify-center gap-2">
              <Button size="sm" className="border-none !bg-[#1F2538]">
                View and sell NFTs
              </Button>
              <Button size="sm" className="border-none !bg-[#1F2538]">
                <span className="flex items-center space-x-1">
                  <Icon icon="buy" size={20} color="#98A1C0" className="!h-4" />
                  <span>Buy crypto</span>
                </span>
              </Button>
              <Button size="sm" className="border-none !bg-[#1F2538]">
                Review KYC
              </Button>
            </div>

            <Portfolio tokens={eoaTokenInfo} />
          </div>
        </div>
      )}
    </>
  );
};
