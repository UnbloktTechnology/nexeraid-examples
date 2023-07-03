import React, { useState } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useSwitchNetwork } from "wagmi";
import { avalanche, avalancheFuji, polygonMumbai } from "wagmi/chains";

import { Button, Icon } from "@nexeraprotocol/react-components";

import { TokenDropDown } from "../Components/TokenDropDown";
import { type ITokenInfo } from "../Interfaces";
import { WalletSidebar } from "./Sidebar";

export const Header = () => {
  const { openConnectModal } = useConnectModal();
  const navItems = ["Swap", "Tokens", "NFTs", "Pool"];
  const chainList = [
    {
      value: avalanche.id,
      label: avalanche.name,
      icon: "avalanche-chain",
      pairs: [],
      address: "",
    },
    {
      value: avalancheFuji.id,
      label: avalancheFuji.name,
      icon: "avalanche-chain",
      pairs: [],
      address: "",
    },
    {
      value: polygonMumbai.id,
      label: polygonMumbai.name,
      icon: "polygon-matic",
      pairs: [],
      address: "",
    },
  ];
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chainSelected, setChainSelected] = useState<ITokenInfo>({
    value: avalanche.id,
    label: "Avalanche",
    icon: "avalanche-chain",
    pairs: [],
    address: "",
  });
  const { switchNetwork } = useSwitchNetwork();
  const { isConnected, address } = useAccount();

  const handleNav = (nav: string) => {
    console.log("NavID: ", nav);
  };

  const handleSearch = (search: string) => {
    console.log("Search: ", search);
  };

  const handleChain = (chain: ITokenInfo) => {
    switchNetwork?.(chain.value as number);
    setChainSelected(chain);
  };

  return (
    <>
      {!!address && (
        <WalletSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="relative z-30 flex h-20 w-full items-center justify-between p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="align-center flex">
            <Icon icon="uniswap" size={40} className="mr-2" />
          </div>

          <nav className="flex items-center">
            <ul className="m-0 flex p-0">
              {navItems.map((item, index) => (
                <li key={index} className="ml-10">
                  <a
                    className="bold cursor-pointer text-white"
                    onClick={() => handleNav(item)}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="box-border flex h-11 w-[480px] items-center rounded-xl border-[#ffffff12] bg-[#ffffff12] p-4">
          <Icon icon="search" className="p-1" />

          <input
            type="text"
            placeholder="Search Tokens and NFT collections"
            className="w-full border-transparent bg-transparent px-1 text-white"
            onChange={(e) => handleSearch(e.target.value)}
          />

          <Icon icon="enter" className="p-1" />
        </div>

        <div className="flex w-96 items-center justify-between">
          <Icon icon="dots-menu" />

          <TokenDropDown
            items={chainList}
            selected={chainSelected}
            className="justify-center"
            classNameList={"!w-auto !bg-[#4c82fb3d] !top-[60px]"}
            onSelect={(option) => handleChain(option)}
          />

          <Button
            size="base"
            className="px-base h-10 min-w-[8rem] !rounded-full border-none !bg-[#4c82fb3d] py-3 !text-[#4C82FB]"
            onClick={() => {
              if (openConnectModal) {
                openConnectModal();
              } else {
                setIsSidebarOpen(true);
              }
            }}
          >
            <span className="flex flex-row items-center justify-between">
              {isConnected ? (
                <span className="text-sm">{`${address?.slice(
                  0,
                  5,
                )}...${address?.slice(37)}`}</span>
              ) : (
                <span>Connect |</span>
              )}
              <Icon
                icon="expand"
                size={12}
                color="#4C82FB"
                className="ml-1 mt-2"
              />
            </span>
          </Button>
        </div>
      </div>
    </>
  );
};
